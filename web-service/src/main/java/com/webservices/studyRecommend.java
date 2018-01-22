package com.webservices;
import javax.json.Json;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recommender.inputGenerator;
import com.recommender.studyRecommender;
import com.student.score;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.awt.*;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Path("study-recommend/")
public class studyRecommend {
    private static final studyRecommender recommender = createRecommender();
    private static final inputGenerator inputGen = new inputGenerator();

    private static studyRecommender createRecommender(){
        try{
            return new studyRecommender();
        }
        catch (FileNotFoundException e){
            throw new Error(e);
        }
    }
    public studyRecommend() throws IOException {
    }

    @Path("next-semester-subjects")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecommendedList(@QueryParam("studentId") String studentId,@QueryParam("semester") Integer semester,@QueryParam("gender") String gender, @QueryParam("records") String records, @QueryParam("interests") String interests,@QueryParam("target") Integer target,@QueryParam("faculty") Integer faculty) throws IOException, JSONException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode recordNode = mapper.readTree(records);
            double[] sothich = inputGen.parseIntArray(interests);
            String[] learntCourses = inputGen.learnCourses(recordNode);
            score[] CF_score_list = inputGen.get_CF_score_list(recordNode,studentId, gender, learntCourses, semester);
            score[] predict_score_list = inputGen.get_predict_score_list(recordNode, gender, learntCourses, semester);
            String[] recommendedList_from_objects = recommender.getRecommendedList(studentId, semester, faculty, target, sothich, inputGen.getCGPA(recordNode), CF_score_list, predict_score_list, learntCourses, 0.2, 0.3, 0.5);
            String rep = new JSONObject().put("subjects", Arrays.asList(recommendedList_from_objects)).toString();
            return Response.ok().entity(rep).build();
        }
        catch (Exception e){
            throw new Error(e);
        }
    }

    @Path("study-stragy")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecommendedPath(@QueryParam("studentId") String studentId,@QueryParam("semester") Integer semester,@QueryParam("gender") String gender, @QueryParam("records") String records,@QueryParam("interests") String interests,@QueryParam("target") Integer target,@QueryParam("faculty") Integer faculty) throws IOException, JSONException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode recordNode = mapper
                .readTree(records);
        double[] sothich = inputGen.parseIntArray(interests);
        String[] learntCourses = inputGen.learnCourses(recordNode);
        score[] CF_score_list = inputGen.get_CF_score_list(recordNode,studentId, gender, learntCourses, semester);
        score[] predict_score_list = inputGen.get_predict_score_list(recordNode, gender, learntCourses, semester);
        JsonNode[] path = recommender.getRecommendedPath(studentId, semester, faculty, target, sothich , inputGen.getCGPA(recordNode),CF_score_list,predict_score_list,learntCourses, 0.5, 0.5, 0, 15);
        String[] recommendSubjects = new String[path.length];
        for (int i =0; i< path.length;i++) {
            recommendSubjects[i] = path[i].toString();
        }
        String rep = new JSONObject().put("data",Arrays.asList(recommendSubjects)).toString();
        return Response.ok().entity(rep).build();
    }
}
