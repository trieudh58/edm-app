package com.prediction;

import java.io.*;
import java.util.StringTokenizer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import svm.svm;
import svm.svm_model;
import svm.svm_node;

public class predictor {

    String trainData;
    String modelFile;
    svm_model trainedModel;

    public predictor(String trainData,String modelFile, Boolean trainNewModel) throws IOException {
        this.trainData = trainData;
        this.modelFile = modelFile;
        if(trainNewModel){
            this.trainModel();
        }
        else{
            this.loadModel();
        }

    }

    public svm_model getTrainedModel(){
        return this.trainedModel;
    }

    private void trainModel() throws IOException{
        svm_train var1 = new svm_train();
        String[] var3 = {"-s","4",this.trainData};
        this.trainedModel = var1.run(var3);
        svm.svm_save_model(this.modelFile, this.trainedModel);
    }
    private void loadModel() throws IOException{
        this.trainedModel = svm.svm_load_model(this.modelFile);
    }
    private static double atof(String var0) {
        return Double.valueOf(var0).doubleValue();
    }

    private static int atoi(String var0) {
        return Integer.parseInt(var0);
    }

    public void predictTestfile(BufferedReader var0, DataOutputStream var1, int var3) throws IOException {
        int var4 = 0;
        int var5 = 0;
        double var6 = 0.0D;
        double var8 = 0.0D;
        double var10 = 0.0D;
        double var12 = 0.0D;
        double var14 = 0.0D;
        double var16 = 0.0D;
        int var18 = svm.svm_get_svm_type(this.trainedModel);
        int var19 = svm.svm_get_nr_class(this.trainedModel);
        double[] var20 = null;

        while(true) {
            String var30 = var0.readLine();
            if (var30 == null) {
                if (var18 != 3 && var18 != 4) {
                    System.out.println("Accuracy = " + (double)var4 / (double)var5 * 100.0D + "% (" + var4 + "/" + var5 + ") (classification)\n");
                } else {
                    System.out.println("Mean squared error = " + var6 / (double)var5 + " (regression)\n");
                    System.out.println("Squared correlation coefficient = " + ((double)var5 * var16 - var8 * var10) * ((double)var5 * var16 - var8 * var10) / (((double)var5 * var12 - var8 * var8) * ((double)var5 * var14 - var10 * var10)) + " (regression)\n");
                }

                return;
            }

            StringTokenizer var31 = new StringTokenizer(var30, " \t\n\r\f:");
            double var23 = atof(var31.nextToken());
            int var25 = var31.countTokens() / 2;
            svm_node[] var26 = new svm_node[var25];

            for(int var27 = 0; var27 < var25; ++var27) {
                var26[var27] = new svm_node();
                var26[var27].index = atoi(var31.nextToken());
                var26[var27].value = atof(var31.nextToken());
            }

            double var32;
            if (var3 == 1 && (var18 == 0 || var18 == 1)) {
                var32 = svm.svm_predict_probability(this.trainedModel, var26, var20);
                var1.writeBytes(var32 + " ");

                for(int var29 = 0; var29 < var19; ++var29) {
                    var1.writeBytes(var20[var29] + " ");
                }

                var1.writeBytes("\n");
            } else {
                var32 = svm.svm_predict(this.trainedModel, var26);
                var1.writeBytes(var32 + "\n");
            }

            if (var32 == var23) {
                ++var4;
            }

            var6 += (var32 - var23) * (var32 - var23);
            var8 += var32;
            var10 += var23;
            var12 += var32 * var32;
            var14 += var23 * var23;
            var16 += var32 * var23;
            ++var5;
        }
    }

    public Double predictAStudent(String var30) throws IOException {
        StringTokenizer var31 = new StringTokenizer(var30, " \t\n\r\f:");
        double var23 = atof(var31.nextToken());
        int var25 = var31.countTokens() / 2;
        svm_node[] var26 = new svm_node[var25];

        for(int var27 = 0; var27 < var25; ++var27) {
            var26[var27] = new svm_node();
            var26[var27].index = atoi(var31.nextToken());
            var26[var27].value = atof(var31.nextToken());
        }

        double var32;
        var32 = svm.svm_predict(this.trainedModel, var26);
        return var32;

    }
    public static void main(String[] var0) throws IOException {
        predictor p = new predictor("data/prediction/train.dat", "data/prediction/model.dat", false);

//        //predict using CFScoreGenerator file, output file
//        BufferedReader var3 = new BufferedReader(new FileReader("CFScoreGenerator.dat"));  /// CFScoreGenerator file
//        DataOutputStream var4 = new DataOutputStream(new BufferedOutputStream(new FileOutputStream("output.txt")));   /// output file
//        p.predictTestfile(var3,var4,p.getTrainedModel(),0);
//        var3.close();
//        var4.close();

//        //predict a student
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

        predictorInputFormat inputFormat = new predictorInputFormat("data/prediction/UOCLUONGTHUOCTINH.csv");
        Double result = p.predictAStudent(inputFormat.predictInput(root,3,"Nam","INT3402"));
        System.out.println(result);
    }
}