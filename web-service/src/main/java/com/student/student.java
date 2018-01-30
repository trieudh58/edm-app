/**
 * 
 */
package com.student;

import java.awt.List;
import java.awt.TexturePaint;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.security.KeyStore.TrustedCertificateEntry;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
import java.util.concurrent.CountDownLatch;

import javax.xml.transform.Templates;

import com.evaluation.SimilarityCompare;
import com.minCostMaxFlow_model.MinCostMaxFlow;

public class student {

	/**
	 * 
	 */
	private String name_file;	// ten file chua thong tin cua sinh vien
	private String MSV; 		// Ma Sinh Vien
	private int yearSchool;		// số thứ tự học kì hiện tại ( từ 1 đến ... ) 
	private faculty fal;		// chuyen nganh ( CNTT/KHMT/HTTT/M-TT)
	private int target;			// so thu tu cua target 
	private double[] interest;		// vector so thich --> ( Toan, LapTrinh, TiengAnh, HocThuoc) o muc do bao nhieu theo thang tu 1-5
	private ArrayList<String> StudiedCourses = new ArrayList<String>();	// danh sách các môn đã học.
	private boolean[] list_learnt; // mảng trạng thái đã học hay chưa của các môn.
	private double[][] cost ;	// mang cost de cho vao mo hinh MinCost-MaxFlow ---- value = [0,1]
	private int[][] cap ;		// mang cap de cho vao mo hinh MinCost-MaxFlow ---- value = [0,1]
	public int total_=0;		// tong so tin chi tich luy sau khi duoc goi y ( chi dung de check ) 
	private double current_avg;	// diem trung binh cac mon da hoc
	private int NumberOfCourses;// tong so mon hoc tu chon trong khung chuong trinh
	private score[] CF_score_list; // danh sách độ đo lọc cộng tác cho các môn chưa học của sinh viên
	private score[] predict_score_list; // danh sách độ đo khả năng học tập cho các môn chưa học của từng sinh viên.
	private ArrayList<course> recommendedCourses;
	
	/**
	 * khoi tao student tu cac thong tin
	 * @param yearSchool_ : sinh vien hoc het nam thu may ?
	 * @param fal_ : chuyen nganh ?
	 * @param name_file_ 
	 * @param current_avg_
	 * @throws IOException
	 * 
	 */
	public student(student stu) {
		this.cost = stu.cost;
		this.cap = stu.cap;
		this.name_file = stu.name_file;
		this.MSV = stu.MSV;
		this.yearSchool = stu.yearSchool;
		this.fal = stu.fal;
		this.target = stu.target;
		this.interest = stu.interest;
		this.StudiedCourses = stu.StudiedCourses;
		this.total_ = 0;
		this.current_avg = stu.current_avg;
		this.NumberOfCourses = stu.NumberOfCourses;
		recommendedCourses = new ArrayList<course>();
	}
	
	public student(int yearSchool_, faculty fal_, String name_file_,double current_avg_,int target_,double[] interest_) throws IOException {
		name_file =  name_file_;
		yearSchool = yearSchool_;
		fal = fal_;
		target=target_;
		interest = interest_;
		current_avg=current_avg_;
		NumberOfCourses=fal.numberOfCourse;
		cost = new double[fal.getN()][fal.getN()];
		list_learnt = new boolean[fal.courses.size()];
		recommendedCourses = new ArrayList<course>();
		Arrays.fill(list_learnt, false);

		//	fill mang cost bang gia tri 1
		for(int i = 0; i < cost.length;i++)
		Arrays.fill(cost[i], 1.0);
		//	fill mang cost[][]  = cost[][] tu khung cua chuyen nganh tuong ung 
		cap = fal.CapGenaral();
		//	dua vao du lieu cua tung sinh vien -> set cap tu node ( requirements ) den node ( sink) ...show more
		cap_learntCourse();
		
	}
	
	public student(String MSV_, int yearSchool_, faculty fal_,double current_avg_,int target_,double[] interest_, score[] CF_score_list_, score[] predict_score_list_, String[] learnt_courses) throws IOException {
		MSV = MSV_;
		name_file = "result";
		yearSchool = yearSchool_;
		fal = fal_;
		target=target_;
		interest = interest_;
		current_avg=current_avg_;
		NumberOfCourses=fal.numberOfCourse;
		cost = new double[fal.getN()][fal.getN()];
		list_learnt = new boolean[fal.courses.size()];
		CF_score_list = CF_score_list_;
		predict_score_list = predict_score_list_;
		recommendedCourses = new ArrayList<course>();
		Arrays.fill(list_learnt, false);
		//	fill mang cost bang gia tri 1
		for(int i = 0; i < cost.length;i++)
		Arrays.fill(cost[i], 1.0);
		//	fill mang cost[][]  = cost[][] tu khung cua chuyen nganh tuong ung 
		cap = fal.CapGenaral();
		//	dua vao du lieu cua tung sinh vien -> set cap tu node ( requirements ) den node ( sink) ...show more
		set_learnt_course(learnt_courses);
		
		
	}
	
	public void  set_learnt_course(String[] learnt_courses) {
		
		for (String ID_learnt_course : learnt_courses) {
			try{
//				tìm xem mã môn này có trong danh sách các mon của khoa hay khong 
				course learntCourse = (fal.MAP_ID_course.get(ID_learnt_course));
//				tìm số thứ tự của môn học này trong danh sách môn học của khoa
				int STT = learntCourse.getSTT();
//				cập nhật mảng thông tin về những môn đã học 
				list_learnt[STT-1] = true;
				if(STT > fal.numberOfCourse) continue;
				int credit = learntCourse.getCredit();
				int require_index = fal.numberOfCourse+ learntCourse.getRequirement_ID();
//				set cap từ nguồn đến môn học đã học rồi = 0
				cap[0][STT] = 0;
//				set cap từ node require của môn này đến node đích giảm đi một lượng bằng số tín chỉ của môn.
				cap[require_index][cap.length-1]-=credit;
			}
			catch (Exception e) {
				// System.out.println("Something is wrong with subject : "+ ID_learnt_course + " ( Mã môn học không có trong danh sách môn học của chuyên ngành " + fal.name + " !)");
			}
//			Cập nhật môn học vào danh sách các môn đã học của từng sinh viên.
			StudiedCourses.add(ID_learnt_course); 

		}
	}
	
	/**
	 * @method cap_learntCourse()
	 * @purpose dua vao du lieu cac mon da hoc cua sinh vien ( learnt_course ) 
	 * -> set cap[][] tu node(source) ---> node ( course ) = 0 neu mon nay da duoc hoc.
	 * @throws FileNotFoundException
	 */
	public void cap_learntCourse() throws FileNotFoundException
	{
		Scanner input = new Scanner(new FileReader(name_file+"/learnt_courses.csv"));
		 
		 while ( input.hasNext())
		 {
			// doc tung dong voi dinh dang "MSV,null/ma mon,ma chu cua mon"
			String[] line = input.nextLine().split(",");
			MSV = line[0];
			String id_course = line[2];
			
			try{
				course learntCourse = fal.MAP_ID_course.get(id_course);
				int STT = (learntCourse.getSTT());
				list_learnt[STT-1] = true;
				if(STT > fal.numberOfCourse) continue;
				int credit = learntCourse.getCredit();
				int require_index = fal.numberOfCourse+ learntCourse.getRequirement_ID();
//				set cap từ nguồn đến môn học đã học rồi = 0
				cap[0][STT] = 0;
//				set cap từ node require của môn này đến node đích giảm đi một lượng bằng số tín chỉ của môn.
				cap[require_index][cap.length-1]-=credit;
			}
			catch (Exception e) {
				// System.out.println("Something is wrong with subject : "+ id_course + " ( Mã môn học không có trong danh sách môn học của chuyên ngành " + fal.name + " !)");
			}
			// neu ma mon ( Id ) = null -> mon nay khong nam trong khung chuong
			// trinh cua khoa fal --> bo qua
			if (line[1].equals("null")) continue;
			
			// cập nhật môn này vào danh sách các môn đã học StudiedCourses
			StudiedCourses.add(id_course); 
			
		 }
	}

	 /**
	 * @method get_score_CF(double heso)
	 * @purpose tra ve mang double[] la ket qua score ( lay tu file ) cua phuong phap CF : matrix factoryzation cho cac mon chua hoc cua tung sinh vien
	 * @param heso : he so ( de combine cac rang buoc)
	 * @return double [NumberOfCourses+1]
	 * @throws IOException
	 */
	public double[] get_score_CF() throws IOException
	{
		// khoi tao Array : 'CF_score[]' && len = [NumberOfCourses+1]
		double[] CF_score = new double[NumberOfCourses + 1];
		// Doc tung dong trong file
		Scanner input_CF = new Scanner(new FileReader(name_file+"/CF.csv"));
		while (input_CF.hasNext()) {
			// each 'line' co dinh dang : (MSV, id_course, ket qua du doan)
			String[] line = input_CF.nextLine().split(",");
			String id_course = line[1];
			double CF = Double.parseDouble(line[2]);
			// Tim 'index' tuong ung cua tung mon , luc nay 'CF_score[index]' co
			// gia tri <-> cap[0][index]
			try {
				int index = (int) fal.Map_ID_STT.get(id_course);
				CF_score[index] = CF;

			} catch (Exception e) {
				// System.out.println("## "+ id_course);
			}

		}
		return CF_score;

	}
	
	/**
	 * @param CF_score_list
	 * @return mảng score cho độ đo lọc cộng tác 
	 */
	public double[] get_score_CF_v2() {
		// khoi tao Array : 'CF_score[]' && len = [NumberOfCourses+1]
		double[] CF_score = new double[NumberOfCourses + 1];
		for (score CF_node : CF_score_list) {
			try {
//				tìm STT của môn học trong mcmf
				int index = (int) fal.Map_ID_STT.get(CF_node.getID_course());
				CF_score[index] = CF_node.getScore();

			} catch (Exception e) {
				// System.out.println("CF_SCORE : Something is wrong with subject : "+ CF_node.getID_course() + " ( Mã môn học không có trong danh sách môn học tự chọn của chuyên ngành " + fal.name + " !)");
			}
		}
		return CF_score;
	}
	 /**
	 * @method get_score_Predict(double heso) 
	 * @purpose return double[] as predict score results of 'not learn yet courses' ( take from file ) by model 'score prediction' for each student
	 * @param heso : he so ( de combine cac rang buoc)
	 * @return double [NumberOfCourses+1]
	 * @throws IOException
	 */
	public double[] get_score_Predict() throws IOException {
		Scanner input_Predict = new Scanner(new FileReader(name_file+"/predicted_score.csv"));
		double[] Pre_score = new double[NumberOfCourses + 1];
		// fill array 'Pre_score' = Diem trung binh
		Arrays.fill(Pre_score, (current_avg / 10));
		while (input_Predict.hasNext()) {
			String[] line = input_Predict.nextLine().split(",");
			String id_course = line[1];
			double Pre = Double.parseDouble(line[2]) / 10;
			try {
				int index = (int) fal.Map_ID_STT.get(id_course);
				Pre_score[index] = Pre;
			} catch (Exception e) {
				// System.out.println("predict : " + id_course);
				continue;
				// TODO: handle exception
			}
		}
		return Pre_score;
	}
	
	public double[] get_score_predict_v2() {
		double[] Pre_score = new double[NumberOfCourses + 1];
		Arrays.fill(Pre_score, (current_avg / 10));
		for (score predict_score : predict_score_list) {
			String ID_course = predict_score.getID_course();
			double predict_score_formatted = predict_score.getScore()/10;
//			tìm kiếm STT của môn trong mô hình mcmf
			try {
				int STT = (int) fal.Map_ID_STT.get(ID_course);
				Pre_score[STT] = predict_score_formatted;
			} catch (Exception e) {
				// TODO: handle exception
				// System.out.println("PREDICT_SCORE : Something is wrong with subject : "+ ID_course + " ( Mã môn học không có trong danh sách môn học tự chọn của chuyên ngành " + fal.name + " !)");
				continue;
			}
		}
		return Pre_score;
	}
	 
	 /**
	 * @return mảng score target của từng môn học cho target tương ứng của từng sinh viên.
	 * @throws FileNotFoundException
	 */
	public double[] get_score_target() throws FileNotFoundException
	 {
		 double[][] target_tem = fal.getTarget();
		 double[] Target_score=new double[NumberOfCourses+1];
		 for(int i = 1; i < NumberOfCourses+1;i++)
		 {
			 Target_score[i]=target_tem[target-1][i-1]*0.2;
		 }
		 return Target_score;
	 }
	
	/**
	 * @return mảng score interest của từng môn học ( bao gồm 4 thuộc tính : Toán, Lập trình , Tiếng Anh, Học Thuộc ) được tính bằng cách : 
	 * 						độ yêu thích của sinh viên với 1 môn = TRUNG BÌNH (với 4 thuộc tính ) của (|độ đo 1 thuộc tính - mức độ thuộc tính mà sinh viên đánh giá|)
	 * @throws FileNotFoundException
	 */
	public double[] get_score_interest() throws FileNotFoundException {
		double[][] inter = fal.get_interest();
		double[] interest_score = new double[NumberOfCourses+1];
		
			for(int i = 0; i < NumberOfCourses;i++)
			 {
				for(int contribute = 0; contribute <4; contribute++)
				 {
					interest_score[i+1]+=Math.abs(inter[contribute][i]-interest[contribute])/5;
				 }
				interest_score[i+1]=interest_score[i+1]/(double)4;
			 }
		return  interest_score;
	}
	 
	 /**
	 * @method get_cost_combine(double CF_heso, double Predict_heso)
	 * @purpose combine cost[][] tu ket qua cua 2 rang buoc CF va Du doan diem
	 * @param CF_heso : he so cua rang buoc CF
	 * @param Predict_heso : de so cua rnag buoc Du doan diem
	 * @throws IOException
	 */
	 public void get_cost_combine(double main_heso, double Target_heso, double Interest_heso)
			 throws IOException
	 {
		 double[] CF_score = get_score_CF();
		 double[] Pre_score = get_score_Predict();
		 double[] Target_score = get_score_target();
		 double[] Interest_score = get_score_interest();
		 // combine 2 rangs buoc tren = 1 - (CF_score[i]-Pre_score[i]); 
		 for(int i = 1; i<=NumberOfCourses; i++ )
		 {
			 this.cost[0][i] = 1.0-main_heso*CF_score[i]*Pre_score[i]- Target_heso*Target_score[i]- Interest_heso* Interest_score[i]; 
		 }
		 
//		 for(int h = 0;h<cost.length;h++)
//			{
//				for(int k = 0; k < cost[0].length;k++) System.out.print(cost[h][k] + "     ");
//				System.out.println(" ");
//			}

	 }
	 
	 /**
	 * @param main_heso
	 * @param Target_heso
	 * @param Interest_heso
	 * @throws IOException
	 */
	public void get_cost_combine_v2(double main_heso, double Target_heso, double Interest_heso)
			 throws IOException
	 {
		 double[] CF_score = get_score_CF_v2();
		 double[] Pre_score = get_score_predict_v2();
		 double[] Target_score = get_score_target();
		 double[] Interest_score = get_score_interest();
		 // combine 2 rangs buoc tren = 1 - (CF_score[i]-Pre_score[i]); 
		 for(int i = 1; i<=NumberOfCourses; i++ )
		 {
			 this.cost[0][i] = 1.0-main_heso*CF_score[i]*Pre_score[i]- Target_heso*Target_score[i]- Interest_heso* Interest_score[i]; 
		 }

	 }
	 /**
	 * @name get_cost_combine_mutil()
	 * @param  double Target_heso, double Interest_heso
	 * @purpose ket hop 2 rang buoc CF va Score Predict = PP nhan + set cap[][] bang ket qua thu duoc
	 * @throws IOException
	 */
	public void get_cost_combine_mutil() throws IOException
			 {
				 double[] CF_score = this.get_score_CF();
				 double[] Pre_score = this.get_score_Predict();
//				 combine 2 rang buoc tren = 1 - (CF_score[i]*Pre_score[i]); 
				 for(int i = 1; i <= NumberOfCourses; i++)
				 {
					 cost[0][i]=cost[0][i]-CF_score[i]*Pre_score[i];
					
				 }
		 }
	 

	/**
	 * @purpose tim index ma tai do cost MAX, sử dụng trong quá trình tìm kiếm tập gợi ý thứ 2.
	 * @param choosen
	 * @return indexMax
	 */
	public int getIndexMax(boolean[] choosen){
		
//		int[] indexChoose = new int[NumberOfCourses];
//		int count= 0;
//		for(int i = 0; i < choosen.length ; i++)
//		{
//			if (choosen[i]) {
//				indexChoose[count++]=i;
//			}
//		}
		int indexMax = -1;
		double costMax = 0.0;
		//System.out.println("???" + choosen.length);
		for(int i = 1; i < choosen.length; i++){
			if(!choosen[i]  ) continue;
			
			if(this.cost[0][i] > costMax) {
				indexMax = i;
			//	System.out.println(this.cost[0][i]+ ">"+ costMax);
				costMax = this.cost[0][i] ;
			}
		}
//		System.out.println("OK" + (indexMax) +"  "+ cost[0][indexMax]);
		return indexMax;
	}
	
	/**
	 * @purpose : lay S = mot tap n so co cost[][] lon nhat trong choosen 
	 * @param choosen
	 * @return S
	 */
	public int[] getIndexs(boolean[] choosen) {
		//System.out.println("getIndexs : choosen "+ choosen.length);
		int[] newArr = new int[2];
		for(int i = 0; i<2;i++){
			newArr[i]=getIndexMax(choosen);
			choosen[newArr[i]]=false;
			}
		return newArr;
	}
	
	
	/**
	 * @purpose tao mot student moi co cap[][] dc set = 0 cho nhung mon co cost[][] cao nhat
	 * @param choosen
	 * @return new student with fixed cap
	 * @throws CloneNotSupportedException
	 */
	public student setNewCap(boolean[] choosen) throws CloneNotSupportedException {
		student newStudent= (student) this.clone();
		int[] indexMaxs = getIndexs(choosen);
		for(int i = 0 ; i<indexMaxs.length; i++)
		{
			int indexMax = indexMaxs[i];
			//System.out.println("ok new student ! max cost at : " + (indexMax));
			//	showCap();
			newStudent.cap[0][indexMax]=0;
		}
		//System.out.println("ok new student ! max cost at : " + indexMax);
		//	showCap();
		//	newStudent.cap[0][indexMax+1]=0;
		//System.out.println("after set cap ");
		//showCap();
		
		
		return newStudent;
	}
	
	public void  showCap() {
		 for(int h = 0;h<cap.length;h++)
				{
					for(int k = 0; k < cap[0].length;k++) System.out.print(cap[h][k] + "     ");
					System.out.println(" ");
				}
	}
	
	
	public student clone() {
		return new student(this);
	}
	 
	public void sort(int arr[])
	{
	 int i, j, temp ;
		for ( i = 0 ; i <= 7 ; i++ )
		{
			for ( j = i + 1 ; j <= 8 ; j++ )
			{
				if ( arr[i] > arr[j] )
				{
					temp = arr[i] ;
					arr[i] = arr[j] ;
					arr[j] = temp ;
				}
			}
		}
	}

	public void setResultToArrangement_v2 (boolean[] mincostResult) throws IOException{
		for(int i = 1 ; i <= NumberOfCourses; i++){
			if(mincostResult[i]){
//				is_learnt[i]=true;
				course c = fal.courses.get(i-1);
				resetPQST(c);
				recommendedCourses.add(c);
			}
			
		}
		
		for(int j = 0 ; j < list_learnt.length; j++)
		{
			if(list_learnt[j]) continue;
			course c2 = fal.courses.get(j);
			if(c2.isIs_optional()) continue;
			resetPQST(c2);
			recommendedCourses.add(c2);
		}
	
//		myWrite.close();
	}
	public void setResultToArrangement(boolean[] mincostResult) throws IOException{
		BufferedWriter myWrite = new BufferedWriter(new FileWriter(name_file+"/list_result.csv"));
		for(int i = 1 ; i <= NumberOfCourses; i++){
			if(mincostResult[i]){
//				is_learnt[i]=true;
				course c = fal.courses.get(i-1);
				myWrite.write(getTemplateToArrange(c));
			}
			
		}
		
		for(int j = 0 ; j < list_learnt.length; j++)
		{
			if(list_learnt[j]) continue;
			course c2 = fal.courses.get(j);
			if(c2.isIs_optional()) continue;
			myWrite.write(getTemplateToArrange(c2));
		}
	
		myWrite.close();
	}
	
	/**
	 * @purpose 
	 * @param c
	 * @return
	 */
	public String getTemplateToArrange(course c){
		String[] pqst = c.getPqst().split(";");
		String template = c.getId()+","+c.getPosition()+",0,"+c.getCredit()+"\n";
		if(pqst[0].equals("0")) return template;
		String outPQST="";
				for(String pq : pqst)
				{
//					System.out.println("??? "+ pq);
					course myPQST = fal.MAP_ID_course.get(pq);
//					System.out.println("test : "+ myPQST.getId() + " ? " + myPQST.getSTT());
					if(list_learnt[myPQST.getSTT()-1]) continue;
					else
						outPQST+=pq+";";
				}
				if(outPQST.length()==0) return template;
				outPQST  = outPQST.substring(0, outPQST.length()-1);
				template =  c.getId()+","+c.getPosition()+","+outPQST+","+c.getCredit()+"\n";
			return template;
	}
	
	public void resetPQST(course course) {
		if(course.getPqst().equals("0")) return;
		String[] pqst = course.getPqst().split(";");
		String outPQST="";
		for(String pq : pqst)
		{
			course myPQST = fal.MAP_ID_course.get(pq);
			if(list_learnt[myPQST.getSTT()-1]) continue;
			else
				outPQST+=pq+";";
		}
		if(outPQST.length()==0) outPQST="0";
		else outPQST  = outPQST.substring(0, outPQST.length()-1);
		course.setPqst(outPQST);
	}

	/**
	 * @return the mSV
	 */
	public String getMSV() {
		return MSV;
	}

	/**
	 * @param mSV the mSV to set
	 */
	public void setMSV(String mSV) {
		MSV = mSV;
	}

	/**
	 * @return the yearShool
	 */
	public int getYearShool() {
		return yearSchool;
	}

	/**
	 * @param yearShool the yearShool to set
	 */
	public void setYearShool(int yearShool) {
		this.yearSchool = yearShool;
	}

	/**
	 * @return the fal
	 */
	public faculty getFal() {
		return fal;
	}

	/**
	 * @param fal the fal to set
	 */
	public void setFal(faculty fal) {
		this.fal = fal;
	}

	/**
	 * @return the target
	 */
	public int getTarget() {
		return target;
	}

	/**
	 * @param target the target to set
	 */
	public void setTarget(int target) {
		this.target = target;
	}

	/**
	 * @return the interest
	 */
	public double[] getInterest() {
		return interest;
	}
	
	public double[][] getCost()
	{
		return cost;
	}
	public int[][] getCap()
	{
		return cap;
	}
	public String getNameFile()
	{
		return name_file;
	}
	public double getAVG () { 
		return current_avg;
		
	}

	/**
	 * @param interest the interest to set
	 */
	public void setInterest(double[] interest) {
		this.interest = interest;
	}



	/**
	 * @return the studiedCourses
	 */
	public ArrayList<String> getStudiedCourses() {
		return StudiedCourses;
	}

	/**
	 * @param studiedCourses the studiedCourses to set
	 */
	public void setStudiedCourses(ArrayList<String> studiedCourses) {
		StudiedCourses = studiedCourses;
	}
	/**
	 * @return the is_learnt
	 */
	public boolean[] getIs_learnt() {
		return list_learnt;
	}
	/**
	 * @param is_learnt the is_learnt to set
	 */
	public void setIs_learnt(boolean[] is_learnt) {
		this.list_learnt = is_learnt;
	}

	public void show_is_learnt() {
		for(int i = 0 ; i < list_learnt.length; i++){
			if (list_learnt[i]) {
				course course = fal.courses.get(i);
				System.out.println(MSV + " - " + course.getSTT() + " - " + course.getCourseName() + " - " + course.getId());
			}
		}
	}

	/**
	 * @return the predict_score_list
	 */
	public score[] getPredict_score_list() {
		return predict_score_list;
	}

	/**
	 * @param predict_score_list the predict_score_list to set
	 */
	public void setPredict_score_list(score[] predict_score_list) {
		this.predict_score_list = predict_score_list;
	}

	/**
	 * @return the cF_score_list
	 */
	public score[] getCF_score_list() {
		return CF_score_list;
	}

	/**
	 * @param cF_score_list the cF_score_list to set
	 */
	public void setCF_score_list(score[] cF_score_list) {
		CF_score_list = cF_score_list;
	}
	
	public ArrayList<course> getRecommendedCourses(){
		return recommendedCourses;
	}
}
