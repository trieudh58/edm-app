package com.prediction;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.*;
import java.util.Scanner;
import java.io.FileReader;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.json.Json;

public class predictorInputFormat {

    private Map<String, String[]> subjectFeatureList;
    private List<String> featureHeader;
    private List<String> CHUYEN_NGANH;
    private List<String> LOAI_MON;
    private List<String> BAITAPNHOM;
    private List<String> HINHTHUCTHI;
    private List<String> zeroposition;
    private List<String> featureOrder;

    public predictorInputFormat(String subjectFeatureFile) throws FileNotFoundException {
        String[] chuyennganh = {"ALL", "CNTT", "DTVT"};
        this.CHUYEN_NGANH = Arrays.asList(chuyennganh);
        String[] loaimon = {"KHOI_KIEN_THUC_CHUNG", "KHOI_KIEN_THUC_CHUNG_THEO_LINH_VUC", "KHOI_KIEN_THUC_CHUNG_CNTT_DTVT",
                "KHOI_KIEN_THUC_CHUNG_NHOM_NGANH", "KHOI_KIEN_THUC_NGANH_BATBUOC", "KHOI_KIEN_THUC_NGANH_BOTRO", "MON_TU_CHON"};
        this.LOAI_MON = Arrays.asList(loaimon);
        String[] baitapnhom ={"y", "n"};
        this.BAITAPNHOM = Arrays.asList(baitapnhom);
        String[] hinhthucthi ={"V", "TH", "VD", "TN"};
        this.HINHTHUCTHI = Arrays.asList(hinhthucthi);
        String[] zeroposition = {"Nam", "ALL", "KHOI_KIEN_THUC_CHUNG",
                "KHONGCAN", "y", "V", "0", "0.0","0"};
        this.zeroposition = Arrays.asList(zeroposition);
        String[] featureorder = {"MONTIENQUYET","GIO_LYTHUYET","HINHTHUCTHI","HOCTHUOC","gender","DOKHOMH","LOAI_MON","GPA","KNLAPTRINH","GIO_THUCHANH","semester","TIENGANH","KTTOAN","CGPA","CHUYEN_NGANH","BAITAPNHOM"};
        this.featureOrder = Arrays.asList(featureorder);
        readFeatureList(subjectFeatureFile);
    }

    private Integer gender(String gender){
        if(gender.equals("Nam")||gender.equals("nam")){
            return 0;
        }
        if(gender.equals("Nữ")||gender.equals("nữ")){
            return 1;
        }
        return 0;
    }
    private void readFeatureList(String filename) throws FileNotFoundException {
        Map<String, String[]> subjectFeatureList = new HashMap<String, String[]>();
        Scanner input_target = new Scanner(new FileReader(filename));
        String[] line;
        line = input_target.nextLine().split(",");
        this.featureHeader = Arrays.asList(Arrays.copyOfRange(line, 1, line.length));

        while (input_target.hasNext()){
            line = input_target.nextLine().split(",");
            subjectFeatureList.put(line[0],Arrays.copyOfRange(line, 1, line.length));
        }
        this.subjectFeatureList = subjectFeatureList;
    }
    private Double getSubjectScore(JsonNode records, String subject){
        for(JsonNode record: records){
            if (subject.equals(record.path("subjectCode").asText())){
                JsonNode attempts = record.path("attempt");
                JsonNode attempt = attempts.get(attempts.size()-1);
                return attempt.path("score").asDouble();
            };
        }
        return null;
    }
    private Double getSemesterGPA(JsonNode records, int semester){
        Double total = 0.0;
        Double subjectCount = 0.00000001;
        for(JsonNode record: records){
            JsonNode attempts = record.path("attempt");
            if(attempts.get(attempts.size()-1).path("semester").asInt() == semester){
                subjectCount++;
                total += attempts.get(attempts.size()-1).path("score").asDouble();
            }
        }
        return total/subjectCount;
    }
    private Double getCGPA(JsonNode records){
        Double total = 0.0;
        Double subjectCount = 0.00000001;
        for(JsonNode record: records){
            subjectCount++;
            JsonNode attempts = record.path("attempt");
            total += attempts.get(attempts.size()-1).path("score").asDouble();
        }
        return total/subjectCount;
    }
    private Double prerequisiteSubjectScore(JsonNode records, String[] subjects){
        Double total = 0.0;
        Double subjectCount = 0.00000001;
        List<String> subjectList = Arrays.asList(subjects);
        for(JsonNode record: records){
            JsonNode attempts = record.path("attempt");
            String subjectCode = record.path("subjectCode").asText();
            if(subjectList.contains(subjectCode)){
                subjectCount++;
                total += attempts.get(attempts.size()-1).path("score").asDouble();
            }
        }
        return total/subjectCount;
    }
    public String predictInput(JsonNode records, Integer semester, String gender, String subjectCode) throws IOException {
       try{ String result = "0 ";
        Integer count = 0;
        String[] subjectFeatures = this.subjectFeatureList.get(subjectCode);
        if(subjectFeatures == null)
            return null;
        for(String feature: this.featureOrder) {
            count++;
            if(feature=="semester"){
                result = result + count + ":"+ semester+" ";
            }
            if(feature=="gender"){
                Integer g = gender(gender);
                if(g!=0){
                    result = result + count + ":" + g + " ";
                }
            }
            if(feature=="CGPA"){
                Double cgpa = getCGPA(records);
                if(cgpa!=0){
                    result = result + count + ":" + cgpa + " ";
                }
            }
            if(feature=="GPA"){
                Double gpa = getSemesterGPA(records,semester-1);
                if(gpa!=0){
                    result = result + count + ":" + gpa + " ";
                }
            }
            if(feature=="MONTIENQUYET"){
                String preSubjects = subjectFeatures[this.featureHeader.indexOf("MONTIENQUYET")];
                Double prerequisiteSubjectScore = prerequisiteSubjectScore(records,preSubjects.trim().split("-"));
                if(prerequisiteSubjectScore!=0){
                    result = result + count + ":" + prerequisiteSubjectScore + " ";
                }
            }
            if(feature=="GIO_LYTHUYET"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("GIO_LYTHUYET")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="HINHTHUCTHI"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("HINHTHUCTHI")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + this.HINHTHUCTHI.indexOf(subjectFeature) + " ";
                }
            }
            if(feature=="HOCTHUOC"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("HOCTHUOC")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="DOKHOMH"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("DOKHOMH")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="LOAI_MON"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("LOAI_MON")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + this.LOAI_MON.indexOf(subjectFeature) + " ";
                }
            }
            if(feature=="KNLAPTRINH"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("KNLAPTRINH")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="GIO_THUCHANH"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("GIO_THUCHANH")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="TIENGANH"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("TIENGANH")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="KTTOAN"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("KTTOAN")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + subjectFeature + " ";
                }
            }
            if(feature=="CHUYEN_NGANH"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("CHUYEN_NGANH")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + this.CHUYEN_NGANH.indexOf(subjectFeature) + " ";
                }
            }
            if(feature=="BAITAPNHOM"){
                String subjectFeature = subjectFeatures[this.featureHeader.indexOf("BAITAPNHOM")];
                if(!this.zeroposition.contains(subjectFeature)){
                    result = result + count + ":" + this.BAITAPNHOM.indexOf(subjectFeature) + " ";
                }
            }
        }
        return result;}
        catch (Exception e){
           e.printStackTrace();
        }
        return null;
    }

    public static void main(String[] args) throws IOException {
        predictorInputFormat f = new predictorInputFormat("data/prediction/UOCLUONGTHUOCTINH.csv");
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

        System.out.println(f.predictInput(root,3,"Nam","INT3402"));
    }
}
