package com.recommender;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prediction.predictor;
import com.prediction.predictorInputFormat;
import com.student.score;

import javax.json.Json;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class inputGenerator {

    private static final predictorInputFormat inputFormat = createFormater();
    private static final predictor predictor = createPredictor();
    private static final CFScoreGenerator CFGenerator = newCFScoreGenerator();

    private static predictorInputFormat createFormater(){
        try {
            return new predictorInputFormat("data/prediction/UOCLUONGTHUOCTINH.csv");
        } catch (FileNotFoundException e) {
            throw new Error(e);
        }
    }
    private static predictor createPredictor() {
        try {
            return new predictor("data/prediction/train.dat","data/prediction/model.dat", false);
        } catch (final IOException exc) {
            throw new Error(exc);
        }
    }
    public static CFScoreGenerator newCFScoreGenerator(){
        try{
            return new CFScoreGenerator();
        }
        catch (IOException e){
            throw new Error(e);
        }
    }

    public static String[] learnCourses(JsonNode records){
        List<String> result = new ArrayList<String>();
        for(JsonNode record: records){
            result.add(record.path("subjectCode").asText());
        }
        String[] courses = new String[records.size()];
        courses = result.toArray(courses);
        return courses;
    }
    public static Double getCGPA(JsonNode records){
        Double total = 0.0;
        Double subjectCount = 0.00000001;
        for(JsonNode record: records){
            subjectCount++;
            JsonNode attempts = record.path("attempt");
            total += attempts.get(attempts.size()-1).path("score").asDouble();
        }
        return total/subjectCount;
    }
    public static score[] get_CF_score_list(JsonNode records,String studentid, String gender,String[] learntCourses, Integer semester) throws FileNotFoundException {
        ArrayList<score> scoreList = new ArrayList<score>();
        String[] predictingSubjects = CFGenerator.getIncompletedCourses(learntCourses);
        CFGenerator.addNewData(records,Integer.parseInt(studentid));
        for(String subject: predictingSubjects){
            double score = CFGenerator.predict(studentid,subject);
            scoreList.add(new score(subject, score));
        }
        score[] result = new score[scoreList.size()];
        return scoreList.toArray(result);
    }

    public static score[] get_predict_score_list(JsonNode records,String gender,String[] learntCourses, Integer semester) throws IOException {
        ArrayList<score> scoreList = new ArrayList<score>();
        String[] predictingSubjects = CFGenerator.getIncompletedCourses(learntCourses);
        String predictInput=null;
        for(String subject: predictingSubjects){
            predictInput = inputFormat.predictInput(records,3,"Nam",subject);
            if(predictInput!=null){
                double score = predictor.predictAStudent(predictInput);;
                scoreList.add(new score(subject, score));
            }
        }
        score[] result = new score[scoreList.size()];
        return scoreList.toArray(result);
    }
    public static double[] parseIntArray(String input) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(input);
        double[] gg = new double[root.size()];
        int i=0;
        for(JsonNode item: root){
            gg[i]= item.asDouble();
            i++;
        }
        return gg;
    }

    public static void main(String[] args) throws IOException {
        String records = "[\n" +
                "      {\n" +
                "        \"subjectCode\": \"POL1001\",\n" +
                "        \"attempt\": [\n" +
                "          {\n" +
                "            \"score\": \"6.19\",\n" +
                "            \"semester\": 1\n" +
                "          }\n" +
                "        ]\n" +
                "      }\n" +
                "    ]";
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(records);
        String[] learnt = {"PHI1004","PHI1005"};
        System.out.println(get_CF_score_list(root,"14020000","Nam",learnt,3).length);
    }
}
