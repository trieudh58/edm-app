package com.recommender;


import com.student.faculty;
import com.student.score;
import com.student.student;

import java.io.FileNotFoundException;
import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;

import com.courseArrangement.MyList;
import com.minCostMaxFlow_model.*;

/**
 * @author Kin_meow
 *
 */
public class studyRecommender {

    MinCostMaxFlow mcmf;
    faculty [] faculties;
    /**
     * @throws FileNotFoundException
     *
     */
    public studyRecommender() throws FileNotFoundException {
        // TODO Auto-generated constructor stub
        mcmf = new MinCostMaxFlow();
        faculties = new faculty[4];
        faculties[0] = new faculty("Cong Nghe Thong Tin Chuan", "data/faculty/CNTT_chuan_full");
        faculties[1] = new faculty("Cong Nghe Thong Tin CLC ", "data/faculty/CNTT_CLC_full");
        faculties[2] = new faculty("Khoa Hoc May Tinh", "data/faculty/KHMT_full_last");
    }

    /**
     * @method getRecommendedList()
     * @purpose gợi ý lộ trình những môn mà sinh viên cần học để hoàn thiện chương trình với input chỉ bao gồm các object ( không đọc từ file )
     * @return danh sách mã môn được gợi ý
     * @param
     * 			+ String @MSV : mã sinh viên
     * 			+ int @current_semester_number : số thứ tự của học kì hiện tại ( vừa hoàn thành hoặc học kì đang học ) : bắt đầu từ 1 đến tối đa là 12
     *
     * 			+ int @faculty :   mã số chuyên ngành tương ứng của sinh viên trong đó :
     * 							- 0 : Công Nghệ Thông Tin Chuẩn.
     * 							- 1 : Công Nghệ Thông Tin CLC.
     * 							- 2 : Khoa học máy tính.
     * 							- 3 : Hệ Thống Thông Tin
     * 							- 4 : Mạng và Truyền thông. ( hiện tại chưa có file dữ liệu )
     *
     * 			+ int @target : Mã số định hướng nghề nghiệp ( xem thêm trong phần mô tả )
     *
     * 			+ int[] @interests : mảng chứa thông tin về sở thích và định hướng của sinh viên, lần lượt bao gồm :
     * 							- Toán ( mức độ yêu thích từ 1-5 )
     * 							- Lập trình ( mức độ yêu thích từ 1-5 )
     * 							- Tiếng Anh ( mức độ yêu thích từ 1-5 )
     * 							- Học thuộc ( mức độ yêu thích từ 1-5 )
     *
     * 			+ double @avg : điểm trung bình tính đến hiện tại của sinh viên.
     * 			+  score[] @CF_score_list : danh sách độ đo lọc cộng tác
     * 			+  score[] @predict_score_list : danh sách độ đo dự đoán điểm
     * 			+  String[] @learntCourse : danh sách các môn đã học.
     *
     * 			+ double @a @b @c : các hệ số quyết định cách kết hợp các score (main score, sở thích , định hướng ) trong mô hình gợi ý.
     * @throws IOException
     * @throws FileNotFoundException
     */
    public String[] getRecommendedList(String MSV, int current_semester_number, int faculty,int target, double[] interests, double avg, score[] CF_score_list, score[] predict_score_list,String[] learntCourse, double a, double b, double c) throws IOException {

        student stu = new student(MSV,current_semester_number,faculties[faculty], avg, target, interests, CF_score_list, predict_score_list, learntCourse );
        stu.get_cost_combine_v2(a, b, c);
        return mcmf.getRecommendedList(stu);
    }
    /**
     * @method getRecommendedList()
     * @purpose gợi ý lộ trình những môn mà sinh viên cần học để hoàn thiện chương trình với cách đọc dl từ file
     * @return danh sách mã môn được gợi ý
     * @param
     * 			+ String @folder_path_student_info : folder chứa thông tin về các độ đo cần thiết cho các môn mà sinh viên này chưa học, bao gồm :
     * 									   		-	Độ đo lọc cộng tác (tên file bắt buộc đặt là "CF.csv")
     * 											-	kết quả dự đoán điểm  (tên file bắt buộc là "predicted_score.csv")
     * 											-	Danh sách các môn đã học của sinh viên ( tên file bắt buộc là "learnt_courses.csv"
     *
     * 			+ int @current_semester_number : số thứ tự của học kì hiện tại ( vừa hoàn thành hoặc học kì đang học ) : bắt đầu từ 1 đến tối đa là 12
     *
     * 			+ int @faculty :   mã số chuyên ngành tương ứng của sinh viên trong đó :
     * 							- 0 : Công Nghệ Thông Tin Chuẩn.
     * 							- 1 : Công Nghệ Thông Tin CLC.
     * 							- 2 : Khoa học máy tính.
     * 							- 3 : Hệ Thống Thông Tin
     * 							- 4 : Mạng và Truyền thông. ( hiện tại chưa có file dữ liệu )
     *
     * 			+ int @target : Mã số định hướng nghề nghiệp ( xem thêm trong phần mô tả )
     *
     * 			+ int[] @interests : mảng chứa thông tin về sở thích và định hướng của sinh viên, lần lượt bao gồm :
     * 							- Toán ( mức độ yêu thích từ 1-5 )
     * 							- Lập trình ( mức độ yêu thích từ 1-5 )
     * 							- Tiếng Anh ( mức độ yêu thích từ 1-5 )
     * 							- Học thuộc ( mức độ yêu thích từ 1-5 )
     *
     * 			+ double @avg : điểm trung bình tính đến hiện tại của sinh viên.
     *
     * 			+ double @a @b @c : các hệ số quyết định cách kết hợp các score (main score, sở thích , định hướng ) trong mô hình gợi ý.
     * @throws IOException
     * @throws FileNotFoundException
     */
    public String[] getRecommendedList(String folder_path_student_info,int current_semester_number, int faculty,int target, double[] interests, double avg, double a, double b, double c) throws IOException {

        student stu = new student(current_semester_number,faculties[faculty],folder_path_student_info, avg, target, interests );
        stu.get_cost_combine(a, b, c);
        return mcmf.getRecommendedList(stu);
    }

    /**
     * @method getRecommendedPath()
     * @purpose gợi ý lộ trình những môn theo kì mà sinh viên cần học để hoàn thiện chương trình với input chỉ bao gồm các object
     * @return Danh sách JsonNode chứa thông tin về các môn học được phân theo từng kì ở định dạng JSON :
     * 				{
     * 					"subject":"INT1003",
     * 					"name":"Tin học cơ sở 1",
     * 					"credit":"2",
     * 					"semester":"5"
     * 				}
     * @param
     * 			+ String @MSV : mã sinh viên
     * 			+ int @current_semester_number : số thứ tự của học kì hiện tại ( vừa hoàn thành hoặc học kì đang học ) : bắt đầu từ 1 đến tối đa là 12
     *
     * 			+ int @faculty :   mã số chuyên ngành tương ứng của sinh viên trong đó :
     * 							- 0 : Công Nghệ Thông Tin Chuẩn.
     * 							- 1 : Công Nghệ Thông Tin CLC.
     * 							- 2 : Khoa học máy tính.
     * 							- 3 : Hệ Thống Thông Tin
     * 							- 4 : Mạng và Truyền thông. ( hiện tại chưa có file dữ liệu )
     *
     * 			+ int @target : Mã số định hướng nghề nghiệp ( xem thêm trong phần mô tả )
     *
     * 			+ int[] @interests : mảng chứa thông tin về sở thích và định hướng của sinh viên, lần lượt bao gồm :
     * 							- Toán ( mức độ yêu thích từ 1-5 )
     * 							- Lập trình ( mức độ yêu thích từ 1-5 )
     * 							- Tiếng Anh ( mức độ yêu thích từ 1-5 )
     * 							- Học thuộc ( mức độ yêu thích từ 1-5 )
     *
     * 			+ double @avg : điểm trung bình tính đến hiện tại của sinh viên.
     * 			+  score[] @CF_score_list : danh sách độ đo lọc cộng tác
     * 			+  score[] @predict_score_list : danh sách độ đo dự đoán điểm
     * 			+  String[] @learntCourse : danh sách các môn đã học.
     *
     * 			+ double @a @b @c : các hệ số quyết định cách kết hợp các score (main score, sở thích , định hướng ) trong mô hình gợi ý.
     *			+ int @total_credit_per_semester : số lượng tín chỉ tối đa trong 1 kì
     * @throws IOException
     * @throws FileNotFoundException
     */
    public  JsonNode[] getRecommendedPath(String MSV, int current_semester_number, int faculty,int target, double[] interests, double avg, score[] CF_score_list, score[] predict_score_list,String[] learntCourse, double a, double b, double c, int total_credit_per_semester) throws IOException {

        student stu = new student(MSV,current_semester_number,faculties[faculty], avg, target, interests, CF_score_list, predict_score_list, learntCourse );
        stu.get_cost_combine_v2(a, b, c);
        mcmf.getRecommendedList(stu);
        MyList courseArrangement = new MyList(stu.getRecommendedCourses());
        return courseArrangement.getRecommendedPath(faculties[faculty], current_semester_number, total_credit_per_semester);
    }
    /**
     * @method getRecommendedPath()
     * @return Danh sách JsonNode chứa thông tin về các môn học được phân theo từng kì ở định dạng JSON :
     * 				{
     * 					"subject":"INT1003",
     * 					"name":"Tin học cơ sở 1",
     * 					"credit":"2",
     * 					"semester":"5"
     * 				}
     * @param (như trong hàm getRecommendedList() và thêm tham số total_credit_per_semester vào cuối cùng )
     * 			+ int @total_credit_per_semester : tổng số tín chỉ mong muốn tối đa trong một kì.
     * @method getRecommendedList()
     * @purpose gợi ý lộ trình những môn mà sinh viên cần học để hoàn thiện chương trình.
     * @return danh sách mã môn được gợi ý
     * @param
     * 			+ String @folder_path_student_info : folder chứa thông tin về các độ đo cần thiết cho các môn mà sinh viên này chưa học, bao gồm :
     * 									   		-	Độ đo lọc cộng tác (tên file bắt buộc đặt là "CF.csv")
     * 											-	kết quả dự đoán điểm  (tên file bắt buộc là "predicted_score.csv")
     * 											-	Danh sách các môn đã học của sinh viên ( tên file bắt buộc là "learnt_courses.csv"
     *
     * 			+ int @current_semester_number : số thứ tự của học kì hiện tại ( vừa hoàn thành hoặc học kì đang học ) : bắt đầu từ 1 đến tối đa là 12
     *
     * 			+ int @faculty :   mã số chuyên ngành tương ứng của sinh viên trong đó :
     * 							- 0 : Công Nghệ Thông Tin Chuẩn.
     * 							- 1 : Công Nghệ Thông Tin CLC.
     * 							- 2 : Khoa học máy tính.
     * 							- 3 : Hệ Thống Thông Tin
     * 							- 4 : Mạng và Truyền thông. ( hiện tại chưa có file dữ liệu )
     *
     * 			+ int @target : Mã số định hướng nghề nghiệp ( xem thêm trong phần mô tả )
     *
     * 			+ int[] @interests : mảng chứa thông tin về sở thích và định hướng của sinh viên, lần lượt bao gồm :
     * 							- Toán ( mức độ yêu thích từ 1-5 )
     * 							- Lập trình ( mức độ yêu thích từ 1-5 )
     * 							- Tiếng Anh ( mức độ yêu thích từ 1-5 )
     * 							- Học thuộc ( mức độ yêu thích từ 1-5 )
     *
     * 			+ double @avg : điểm trung bình tính đến hiện tại của sinh viên.
     *
     * 			+ double @a @b @c : các hệ số quyết định cách kết hợp các score (main score, sở thích , định hướng ) trong mô hình gợi ý.
     * 			+ int @total_credit_per_semester : số lượng tín chỉ tối đa trong 1 kì
     * @throws IOException
     */
    public JsonNode[] getRecommendedPath(String folder_path_student_info,int current_semester, int faculty,int target, double[] interests, double avg, double a, double b, double c,int total_credit_per_semester ) throws IOException {

        student stu = new student(current_semester,faculties[faculty],folder_path_student_info, avg, target, interests );
        stu.get_cost_combine(a, b, c);
        mcmf.getRecommendedList(stu);
        MyList courseArrangement = new MyList(stu.getRecommendedCourses());
        return courseArrangement.getRecommendedPath(faculties[faculty], current_semester, total_credit_per_semester);
    }


    /**
     * purpose : test 3 chức năng chính :
     * 				+ getRecommendedList() : gợi ý danh sách các môn
     * 				+ getRecommendedPath() : gợi ý danh sách các môn theo kì theo 2 cách gọi hàm
     * @param args
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
//		khởi tạo mô hình gợi ý.
        studyRecommender recommender = new studyRecommender();

//		định nghĩa trước một số tham số cần thiết.
        double[] sothich = {2,3,4,3};
        score[] CF_score_list = score.get_score_list_from_file("newData/14020000/CF.csv");
        score[] predict_score_list = score.get_score_list_from_file("newData/14020000/predicted_score.csv");
        String[] learntCourses = {"PHI1004","PHI1005","FLF1105","FLF1106","FLF1107","HIS1002","INT2202","FLF1108","FLF1109","INT1006","POL1001","INT2203","PHY1100","MAT1093","MAT1094","INT2205","INT2204","INT2208","PHY1103","MAT1095","INT2209","INT2206","INT1050"};


//		Hàm lấy danh sách các môn học được gợi ý với INPUT lấy từ các object đã tạo trước, không đọc từ file !
        String[] recommendedList_from_objects = recommender.getRecommendedList("14020000", 4, 2, 1,sothich , 7.0,CF_score_list,predict_score_list,learntCourses, 0.2, 0.3, 0.5);
        for (String courseID : recommendedList_from_objects) {
            System.out.print(courseID+"\t");
        }
        System.out.println("\n\n\n");

//		Hàm gợi ý lộ trình theo kì với INPUT chỉ bao gồm các object đã tạo trước, không đọc từ file !
        JsonNode[] path = recommender.getRecommendedPath("1402000", 4, 2, 1, sothich , 9.0,CF_score_list,predict_score_list,learntCourses, 0.5, 0.5, 0, 15);

//		in ra kết quả lộ trình môn học  :
        System.out.println("\n\nLộ trình môn học (chỉ đọc từ object) ");
        for (JsonNode jsonNode : path) {
            System.out.println(jsonNode.toString());
        }


//		Hàm lấy danh sách các môn học được gợi ý với INPUT lấy từ file
//		String[] recommendedList = webservices.getRecommendedList("newDATA/14020000", 4, 2, 1,sothich , 7.0, 0.2, 0.3, 0.5);
//		for (String courseID : recommendedList) {
//			System.out.print(courseID+"\t");
//		}
//		System.out.println("");


//		Nếu muốn lấy luôn lộ trình các môn học theo kì mà không muốn chạy lần lượt 2 câu lệnh trên ta chỉ cần chạy câu lệnh sau :
//		webservices.getRecommendedPath(folder_path_student_info, current_semester, faculty, target, interests, avg, a, b, c, total_credit_per_semester)
//		JsonNode[] path2 = webservices.getRecommendedPath("newDATA/14020000", 4, 2, 1, sothich , 9.0, 0.5, 0.5, 0, 15);

//		in ra kết quả lộ trình môn học  :
//		System.out.println("\n\nLộ trình môn học (trực tiếp) ");
//		for (JsonNode jsonNode : path2) {
//			System.out.println(jsonNode.toString());
//		}
    }

}
