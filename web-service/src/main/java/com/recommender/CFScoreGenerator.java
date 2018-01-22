package com.recommender;

import com.fasterxml.jackson.databind.JsonNode;
import org.mymedialite.ratingprediction.MatrixFactorization;

import javax.json.Json;
import javax.security.auth.Subject;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class CFScoreGenerator {
    private static List<String> subjectList;
    private static List<String> studentList;
    private static MatrixFactorization ratingPredictor = new MatrixFactorization();
    private static List<String> selectiveSubjects;

    CFScoreGenerator() throws IOException {
        readSubjectList("data/CF/subjectlist.txt");
        readStudentList("data/CF/studentList.txt");
        loadSelectiveSubject("data/faculty/danh_sach_mon_tu_chon.txt");
        this.ratingPredictor.loadModel("data/CF/CF_model.txt");
        this.ratingPredictor.setMaxRating(1);
    }
    private void readSubjectList(String filename) throws FileNotFoundException {
        Scanner input = new Scanner(new FileReader(filename));
        List<String> subjectList = new ArrayList<String>();
        while( input.hasNext()){
            String line = input.nextLine();
            subjectList.add(line);
        }
        this.subjectList = subjectList;
    }
    private void readStudentList(String filename) throws FileNotFoundException {
        Scanner input = new Scanner(new FileReader(filename));
        List<String> studentList = new ArrayList<String>();
        while( input.hasNext()){
            String line = input.nextLine();
            if(studentList.indexOf(line)<0){
                studentList.add(line);
            }
        }
        this.studentList = studentList;
    }
    private void loadSelectiveSubject(String filename){
        try{
            Scanner input = new Scanner(new FileReader(filename));
            List<String> subjectList = new ArrayList<String>();
            while( input.hasNext()){
                String line = input.nextLine();
                subjectList.add(line);
            }
            this.selectiveSubjects = subjectList;
        }
        catch (FileNotFoundException e){
            throw new Error(e);
        }

    }
    public String[] getIncompletedCourses(String[] learntCourses){
        List<String> learnt = Arrays.asList(learntCourses);
        String[] result = new String[selectiveSubjects.size()];
        int index=0;
        for(int i=0; i<selectiveSubjects.size();i++){
            if(learnt.indexOf(selectiveSubjects.get(i))<0){
                result[index] = selectiveSubjects.get(i);
                index++;
            }
        }
        return result;
    }
    public Double predict(Integer studentId, Integer subjectId){
        return this.ratingPredictor.predict(studentId,subjectId);
    }
    public Double predict(String studentId, String subjectId){
        int userId = studentList.indexOf(studentId);
        int maxUserID = ratingPredictor.maxUserID();
        if(userId<0 || userId>maxUserID ) userId=maxUserID;
        int subject = subjectList.indexOf(subjectId);
        if(userId>=0&&subject>=0)
        return this.ratingPredictor.predict(userId ,subject);
        return 0.0;
    }
    public void addNewData(JsonNode records,Integer studentId){

    }
    public static void main(String[] args) throws IOException {

        CFScoreGenerator tt = new CFScoreGenerator();
        System.out.println(tt.predict(89,2));
    }
}
