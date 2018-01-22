/**
 * 
 */
package com.courseArrangement;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.CountDownLatch;

import javax.activation.UnsupportedDataTypeException;
import javax.swing.text.html.HTMLDocument.HTMLReader.PreAction;
import javax.swing.undo.UndoableEditSupport;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.student.course;
import com.student.faculty;
import com.student.require;
import com.student.student;

/**
 * @author Kin_meow
 *
 */
public class MyList {

	ArrayList<CourseNode> myList;
	Map <String, Integer > mapTextIdToIndex;
	int[] currentMaxIn;
	
	public MyList(ArrayList<course> recommendedCourses){
		myList = new ArrayList<CourseNode>();
		mapTextIdToIndex = new HashMap<String,Integer>();
		int count = 0;
		for (course course : recommendedCourses) {
			CourseNode courseNode = new CourseNode(course);
			myList.add(courseNode);
			mapTextIdToIndex.put(course.getId(),count++);
		}
		currentMaxIn = new int[myList.size()];
		setConnect();
		setTotalUnderNode();
		setMaxOut();
		setMaxIn();
	}
	/**
	 * @param nameFile : tên file chứa kết quả danh sách các môn học được gợi ý với format trên một dòng như sau :
	 * 					 ( textID, position, prqs, credit )
	 * 					 + textID : mã môn học
	 * 					 + position : vị trí của môn trong khung chương trình
	 * 				 	 + prqs : các môn tiên quyết ( cách nhau bởi dấu ";" )
	 * 				     + credit : số tín chỉ
	 * 
	 * @throws FileNotFoundException
	 */
	public MyList(String nameFile) throws FileNotFoundException {
		myList = new ArrayList<CourseNode>();
		mapTextIdToIndex = new HashMap<String,Integer>();
		Scanner input = new Scanner(new File(nameFile));
		int count = 0;
		while(input.hasNext()){
			String[] eachLine = input.nextLine().split(",");
			String textId = eachLine[0];
			int position = Integer.parseInt(eachLine[1]);
			//System.out.println(textId + "/"+ eachLine[2]);
			String[] prqs = eachLine[2].split(";");
			int credit_ = Integer.parseInt(eachLine[3]);
			CourseNode courseNode = new CourseNode(textId, position,prqs,credit_);
			
			myList.add(courseNode);
			mapTextIdToIndex.put(textId,count++);
			
		}
		
		currentMaxIn = new int[myList.size()];
		setConnect();
		setTotalUnderNode();
		setMaxOut();
		setMaxIn();
		
		
	}
	
	public void setConnect() {
		for(CourseNode cNode : myList){
			if (cNode.numOfPrerequisite == 0 ) continue;
			for(String pre : cNode.prqs){
				//System.out.println(cNode.TextId + "OK");
//				System.out.println(pre);
				CourseNode parent = myList.get(mapTextIdToIndex.get(pre));
				cNode.addParent(parent);
				parent.addChild(cNode);						
			}
			//System.out.println(cNode.TextId + " OK ");
		}
	}
	
	public void setTotalUnderNode() {
		for(CourseNode cNode : myList){
			cNode.totalUnderNode = countTotalUnderNode(cNode);
		}
	}
	
	public int countTotalUnderNode(CourseNode courseNode) {
		if(courseNode.children.size()==0) return 0;
		int sum = courseNode.children.size();
		for(CourseNode cNode : courseNode.children){
			sum += countTotalUnderNode(cNode);
		}
		return sum;
	}
	
	public int countMaxOut(CourseNode courseNode){
		if(courseNode.children.size()==0) return 0;
		
		int max = 0;
		for(CourseNode cNode : courseNode.children){
			int count = countMaxOut(cNode)+1;
			if(count > max) max = count;
		}
		return max;
	}
	
	public void setMaxOut(){
		for(CourseNode courseNode : myList){
			courseNode.maxOut = countMaxOut(courseNode);
		}
	}
	
	public int countMaxIn(CourseNode courseNode){
		if(courseNode.parents.size()==0) return 0;
		
		int max = 0;
		for(CourseNode cNode : courseNode.parents){
			int count = countMaxIn(cNode)+1;
			if(count > max) max = count;
		}
		return max;
	}
	
	public void setMaxIn(){
		for(int i = 0; i < myList.size(); i++){
			CourseNode courseNode = myList.get(i);
			currentMaxIn[i] = countMaxIn(courseNode);
			courseNode.maxIn= currentMaxIn[i];
			
		}
	}
	
	public void showList() {
		for(CourseNode courseNode : myList){
			courseNode.showProperty();
		}
	}

	
	public void remove(int index){
		CourseNode currentNode = myList.get(index);
		discountMaxIn(currentNode);
		updateCurrentMaxIn();
	}
	
	public void discountMaxIn(CourseNode courseNode) {
		if(courseNode == null ) return;
		courseNode.maxIn--;
		for(CourseNode cNode : courseNode.children){
			if(cNode.maxIn == courseNode.maxIn+2) discountMaxIn(cNode);
		}
		
	}
	
	public void updateCurrentMaxIn(){
		for(int i = 0 ; i < currentMaxIn.length; i++){
			currentMaxIn[i] = myList.get(i).maxIn;
			//System.out.println(myList.get(i).TextId + "--> " + currentMaxIn[i]);
		}
	}
	
	public int[] getAvailableNodes() {
		int[] avList = new int[100];
		int count = 0;
		for(int i = 0 ; i < currentMaxIn.length ; i ++)
		{
			
			if(currentMaxIn[i]==0) {
				avList[count++] = i;
			}
		}
		return Arrays.copyOfRange(avList,0,count);
	}
	
	public int[] sortAvailbleNodes(int [] avList) {
	//-----------------------------------------------------------------------------------------------------------------			
		for(int i = 0 ; i < avList.length-1; i++){
			
	//-------------------------------------------------------------------------		
			for(int j = i+1; j < avList.length; j++){
				CourseNode node1 = myList.get(avList[i]);
				CourseNode node2 = myList.get(avList[j]);
				if(node2.maxIn > node1.maxIn)
				{
					int tem = avList[i];
					avList[i] = avList[j];
					avList[j] = tem;
				}
				
				else if(node2.maxIn == node1.maxIn)
				{
					if(node2.totalUnderNode > node1.totalUnderNode)
					{
						int tem = avList[i];
						avList[i] = avList[j];
						avList[j] = tem;
					}
					else if(node2.position < node1.position)
					{
						int tem = avList[i];
						avList[i] = avList[j];
						avList[j] = tem;
					}
				}
			}
	//------------------------------------------------------------------------------------			
		}
	//-----------------------------------------------------------------------------------------------------------------		
	
	return avList;
	}
	
	CourseNode[] getNextSemeter(int numOfCourse)
	{
		CourseNode[] myNextSem = new CourseNode[numOfCourse];
		int[] avList = sortAvailbleNodes(getAvailableNodes());
		for(int i = 0 ; i < numOfCourse; i++)
		{
			myNextSem[i]= myList.get(avList[i]);
			remove(avList[i]);
			
		}
		
		return myNextSem;
	}
	
	public ArrayList<CourseNode> getNextSemeterByCredit(int numOfCredit)
	{
		ArrayList<CourseNode> myNextSem = new ArrayList<CourseNode>();
		int count = 0;
		int index = 0;
		int[] avList = sortAvailbleNodes(getAvailableNodes());
		while(count <=numOfCredit )
		{
			if(index + 1 > avList.length) break;
			int current_index = index;
			CourseNode chosenNode = myList.get(avList[current_index]);
			myNextSem.add(chosenNode);
			remove(avList[current_index]);
			index++;
			count+=chosenNode.credit;
		}
		return myNextSem;
	}
	
	public static void showElement(ArrayList<CourseNode> list, faculty fal) throws FileNotFoundException
	{
		
		for(CourseNode courseNode : list)
		{
			//courseNode.showProperty();
			System.out.println(courseNode.TextId + "  " + courseNode.credit + "  " + fal.MAP_ID_course.get(courseNode.TextId).getCourseName());
			
		}
	}
	
	public  JsonNode[] getRecommendedPath(faculty fal, int current_semester, int total_credit_per_semester) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		ArrayList<JsonNode> result = new ArrayList<JsonNode>();
		int count = current_semester+1;
		JsonNode[] nextSemester = getNextSemester(getNextSemeterByCredit(total_credit_per_semester), mapper, fal,count++);
		while(nextSemester.length !=0){
			Collections.addAll(result, nextSemester);
			nextSemester = getNextSemester(getNextSemeterByCredit(total_credit_per_semester), mapper, fal,count++);
		}
		JsonNode[] finalResult = new JsonNode[result.size()];
		finalResult = result.toArray(finalResult);
		return finalResult;
		
	}
	public static JsonNode[] getNextSemester(ArrayList<CourseNode> list,ObjectMapper mapper, faculty fal, int semester_number) throws JsonParseException, JsonMappingException, IOException{
		ArrayList<JsonNode> result = new ArrayList<JsonNode>();
		for(CourseNode courseNode : list)
		{
			result.add( mapper.readValue("{\"subject\":\""+courseNode.TextId+"\","
					+ "\"name\":\""+fal.MAP_ID_course.get(courseNode.TextId).getCourseName()+"\","
					+ "\"credit\":\""+courseNode.credit+"\",\"semester\":\""+semester_number+"\"}", JsonNode.class));		
		}
		JsonNode[] finalResult = new JsonNode[result.size()];
		finalResult = result.toArray(finalResult);
		return finalResult;
	}
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		faculty CNTT = new faculty("Cong Nghe Thong Tin", "data/faculty/CNTT_chuan_full");
		faculty KHMT = new faculty("Khoa Hoc May Tinh", "data/faculty/KHMT_full_last");
		// TODO Auto-generated method stub
		MyList mList = new MyList("newData/14020000/list_result.csv");
//		mList.showList();
		//mList.remove(4);
//		System.out.println("NEXT SEMETER : _____________________________________________________________");
//		showElement(mList.getNextSemeter(5));
//		
		//System.out.println("AFTER : --------------------------------------------------------------");
		//mList.showList();
		
		JsonNode[] result = mList.getRecommendedPath(KHMT, 4, 15);
		for (JsonNode jsonNode : result) {
			System.out.println(jsonNode.toString());
		}

	}

}
