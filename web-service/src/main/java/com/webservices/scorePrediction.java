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
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(records);
        Double result = predictor.predictAStudent(predictFormat.predictInput(root, semester, gender, subjectCode));
        JSONObject score = new JSONObject();
        score.put("score", result);
        String rep = new JSONObject().put("predictScore", score).toString();
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
