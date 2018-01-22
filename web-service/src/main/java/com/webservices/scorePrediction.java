package com.webservices;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prediction.*;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.IOException;

@Path("score/")
public class scorePrediction {
    private static final predictor predictor = createPredictor();
    private static final predictorInputFormat predictFormat = createFormater();
    private static predictor createPredictor() {
        try {
            return new predictor("data/prediction/train.dat","data/prediction/model.dat", false);
        } catch (final IOException exc) {
            throw new Error(exc);
        }
    }
    private static predictorInputFormat createFormater(){
        try {
            return new predictorInputFormat("data/prediction/UOCLUONGTHUOCTINH.csv");
        } catch (FileNotFoundException e) {
            throw new Error(e);
        }
    }
    public scorePrediction() throws IOException {
    }

    @Path("predict")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response scorePredict(@QueryParam("subjectCode") String subjectCode, @QueryParam("gender") String gender, @QueryParam("semester") Integer semester, @QueryParam("records") String records) throws IOException, JSONException {
        System.out.println(0);
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(1);
        JsonNode root = mapper.readTree(records);
        System.out.println(2);
        Double result = predictor.predictAStudent(predictFormat.predictInput(root, semester, gender, subjectCode));
        System.out.println(3);
        JSONObject score = new JSONObject();
        System.out.println(4);
        score.put("score", result);
        System.out.println(5);
        String rep = new JSONObject().put("predictScore", score).toString();
        System.out.println(6);
        return Response.ok().entity(rep).build();
    }

    @Path("predict_list")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response scorePredict2(@QueryParam("subjectCode") String subjectCode) throws IOException, JSONException {
        String rep = new JSONObject().put("message", "not implemented").toString();
        return Response.ok().entity(rep).build();
    }
}
