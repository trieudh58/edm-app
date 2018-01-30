/**
 * luu tru thong tin ve khung chuong trinh cua mot CHUYEN NGANH trong khoa CNTT 
 * chi bao gom cac mon tu chon/bo tro theo dinh dang cho truoc
 * 
 */
package com.student;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.annotation.Target;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

import org.omg.PortableServer.THREAD_POLICY_ID;

public final class faculty {

	String name;						// Ten CHUYEN NGANH ( CNTT/ KHMT / HTTT / M-TT )
	String path_file;					// Path file luu khung chuong trinh CHUYEN NGANH nay.
	public ArrayList <course> courses;	// Danh sach cac mon hoc bo tro/tu chon 
	ArrayList <require> requires;		// Danh sach cac rang buoc
    int numberOfCourse ;				// courses.number	số lượng các môn học tự chọn trong khung
	int numberOfRequire;				// requires.number
	Map Map_ID_STT ;					// Map ID <--> STT cua tung course trong mô hình mcmf (chỉ có những môn tự chọn )
	public  Map <String, course> MAP_ID_course; // Map ID -> course object ( tất cả các môn trong khung )
	
//	public void Set_MapKhungFull() throws FileNotFoundException{
//		Scanner input_full = new Scanner(new File("Data/faculty/CNTT_chuan_full"));
//		while
//	}

	public faculty(String name_, String path_) throws FileNotFoundException {
		// TODO khoi tao faculty tu name va path file's name
		Map_ID_STT =new HashMap<String,Integer>();
		MAP_ID_course = new HashMap<String,course>();
		name = name_;
		path_file = path_;
		courses = new ArrayList<course>();
		requires = new ArrayList<require>();
		//	khoi tao reader de doc file "khung chuong trinh - cntt"
		Scanner reader = new Scanner(new FileReader(path_file));
		//	 line - doc tung dong trong file
		String [] line;
		//	count_ID - set STT cho tung mon hoc trong mo hinh minCost-maxFlow =  trung voi vi tri cua NODE trong do thi 
		//ID_require trong file phải được định dạng bắt đầu từ ID = 1 và liên tiếp tăng dần.
		int count_ID = 1; 	
		int ID_require_current = 0;
		//flag để phân biệt khi nào là môn bổ trợ 
		boolean is_optional = true;
		//	Đọc từng dòng và khởi tạo mỗi course từ mỗi dòng...
		// Dinh dang tung dong : (course_id <string> , course name, credit, Id_require, total credits need for that require)
		while (reader.hasNext())
		{
			//-------( ELT3144,Xu ly tin hieu so,3,1,5 )----------
			line = reader.nextLine().split(",");
			
			if(line[0].equals("###")){
				numberOfCourse = courses.size();
				numberOfRequire = requires.size();
				is_optional=false;
				continue;
				
			}
			
			int ID_require = Integer.parseInt(line[3]); 
			int total_credit = Integer.parseInt(line[4]);
			String pqst = line[5];
			int position = Integer.parseInt(line[6]);
			boolean is_op = false;
			if(line[7].equals("1")) is_op = true;
			//System.out.println(line[8]);
			
			int id_khung = Integer.parseInt(line[8]);
			
			//nếu gặp đc require mới thì khởi tạo require đó. các giá trị bị trùng require_id sẽ không được thêm vào LIST requires.
			if(ID_require != ID_require_current) 
				{
					requires.add(new require(ID_require,total_credit));
					ID_require_current = ID_require;
				}
			//khởi tạo các course 
			course new_course = new course(count_ID++,line[0],line[1],Integer.parseInt(line[2]),ID_require,pqst,position,is_op,id_khung);
			courses.add(new_course);
			// Them vao MAP gia tri id <--> STT vua them ( chỉ với các mộn tự chọn )
			
			if(is_optional) Map_ID_STT.put(new_course.getId(),new_course.getSTT());
			MAP_ID_course.put(new_course.getId(), new_course);
//			System.out.println("MAP : " + new_course.getId() + " - " + new_course.getSTT());
			
			
		}
		//N = courses.size() + requires.size()+2;

		
		//System.out.println(Map_ID_STT.entrySet());
		
	}
	
	public int getN ()
	{
		return (this.numberOfCourse + this.numberOfRequire + 2);
	}
	
	/**
	 * @return mang cap[][] chung cho tat ca cac sinh vien trong cung mot CHUYEN NGANH
	 * @throws IOException 
	 * 
	 */
	public int[][] CapGenaral () 
	{
		int N = getN(); // N là tổng số node trong đồ thị - tính cả điểm đầu và cuối
//		System.out.println("???????"+N);
		int[][] cap = new int[N][N];
		int source = 0;
		int sink = N-1;
		//System.out.println(numberOfCourse +"   "+ numberOfRequire);
		//set các giá trị cap của các cạnh liên quan tới mỗi course = số tín chỉ (credit) của course đó
		for(int i = 1; i <= numberOfCourse ; i++)
		{
			course co = courses.get(i-1);
			cap[source][i] = co.getCredit(); // set cap cạnh từ nguồn (sourse ) - > course
			cap[i][numberOfCourse+co.getRequirement_ID()]= co.getCredit(); // set cap cạnh từ course đến require của nó 
		}
		//set cap từ các require đến sink = total_credit_each_require.
		for(int j = 0 ; j < numberOfRequire; j++)
		{
			require re = requires.get(j);
			cap[ numberOfCourse + re.getID()][sink]  = re.getTotal_credit();
		}
		return cap;
		
	}
	
	
	
	
	/**
	 * @purpose return array[][] to calculate score of requirement ( target ) for each course
	 * @return return array[][] contains value as you see in file Data/faculty/DinhHuongNgheNghiep.csv
	 * @throws FileNotFoundException
	 */
	public double[][] getTarget() throws FileNotFoundException
	{
		//System.out.println("______________--->  "+ numberOfCourse);
		 double[][] target = new double[15][numberOfCourse];
		 Scanner input_target = new Scanner(new FileReader("data/faculty/DinhHuongNgheNghiep.csv"));
		 // Array 'STT' dung de luu thong tin STT cua course 
		 //--- duoc doc tu dong dau tien trong file
		 //--- ( co the khong theo thu tu nhu 1--->n)  
		
		 // var luu cac gia tri id 
		 String[] var = input_target.nextLine().split(",");
		 int[] STT = new int[var.length];
		 // Map 'id' trong 'var' --> 'STT'
			for (int j = 0; j < var.length; j++)
			{		String MM= var[j];
				try {
						STT[j]= (int) Map_ID_STT.get(MM);
					
				} catch (Exception e) {
					//System.out.println("ERROR ! " + MM +"  ko co trong target file :/ ");
					STT[j]=-1;
				} 
				if(STT[j]>numberOfCourse) STT[j]=-1;
			}
		 // set value cho target[][]
		 // moi TARGET (row) ung voi moi COURSE (column)
		 // chu y : doc den index nao trong 'line' thi set value [target_row] [ STT[index] ]
		 // <--> khong nhat thiet [target_row][0] duoc set dau tien
		 for(int i = 0 ; i <15 ; i ++)
		 {
			 String[] line = input_target.nextLine().split(",");
			 for( int index = 2; index < var.length+2 ; index++)
			 {
				 if(STT[index-2] == -1 ) {continue;}
			//	 System.out.println(STT[index-2] + " $ " + index);
				 Double val = Double.parseDouble(line[index]);
				 target[i][STT[index-2]-1]= val;
			 }
		 }
		 return target;	 
	}
	
	/**
	 * @return
	 * @throws FileNotFoundException
	 */
	public double[][] get_interest () throws FileNotFoundException
	{
		 double[][] interest = new double[4][numberOfCourse];
		 Scanner input_inter = new Scanner(new FileReader("data/faculty/NhomCacMonTheoSoThichKhaNang.csv"));
		 // tuong tu get_target 
		 // Array 'STT' dung de luu thong tin STT cua course 
		 //--- duoc doc tu dong dau tien trong file
		 //--- ( co the khong theo thu tu nhu 1--->n)  
		
		 // var luu cac gia tri id 
		 String[] var = input_inter.nextLine().split(",");
		 int[] STT = new int[var.length];
		 // Map 'id' trong 'var' --> 'STT'
		 for (int j = 0; j < var.length; j++) {
			try{
				STT[j]= (int) Map_ID_STT.get(var[j]);
			}catch (Exception e) {
			//	System.out.println("ERROR ! " + var[j] +"  ko co trong interest file :/ ");
				STT[j]=-1;
			}
			if(STT[j]>numberOfCourse)STT[j]=-1;
		}
		 
		 for(int i = 0 ; i <4 ; i ++)
		 {
			 String[] line = input_inter.nextLine().split(",");
			// for( int index = 2; index < numberOfCourse+2 ; index++)
			 for( int index = 2; index < var.length+2 ; index++)
			 {
				 if(STT[index-2] == -1) continue;
				 Double val = Double.parseDouble(line[index]);
				 interest[i][STT[index-2]-1]= val;
			 }
		 }
		 
//		 for(int h = 0;h<interest.length;h++)
//							{
//								for(int k = 0; k < interest[0].length;k++) System.out.print(interest[h][k] + "     ");
//								System.out.println(" ");
//							}
	 
		return interest;
	}
	
	public void showCourses ()
	{
		for(course c : courses){
			System.out.println("###" + c.getSTT()+ " : " + c.getId() + " - " + c.getCourseName() + " - " + c.getCredit());
		}
	}
	
	
	public static void main(String[] args) throws IOException{
		/*int [][] my;
		faculty CNTT = new faculty("Cong Nghe Thong Tin", "data/faculty/CNTT_CLC_full");
		my = CNTT.CapGenaral();
		for (int i = 0 ; i< my.length; i++)
		{
			
			for(int j = 0 ; j < my.length ; j++) System.out.print(my[i][j] +",");
			System.out.println("");
		}
		
		
		CNTT.showCourses();
		System.out.println(CNTT.numberOfCourse + " / " + CNTT.numberOfRequire);
		System.out.println(CNTT.MAP_ID_course.get("INT2209").getSTT());
		
//		CNTT.getTarget();
//		CNTT.get_interest();
		CNTT.CapGenaral()*/;
		
	}
	
	public int getnumberOfCourse()
	{
		return numberOfCourse;
	}

	public ArrayList<course> getAllCourse() {
		ArrayList<course> copyList = new ArrayList<course>();
		for(course c : courses)
		{
			copyList.add(c);
		}
		return copyList;
	}

}
