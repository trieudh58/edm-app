/**
 * 
 */
package com.courseArrangement;

import java.util.ArrayList;

import com.student.course;

/**
 * @author Kin_meow
 *
 */
public class CourseNode {

	String TextId ;
	ArrayList<CourseNode> parents;
	ArrayList<CourseNode> children;
	int maxIn;
	int maxOut;
	int numOfPrerequisite;
	int position;
	int credit;
	String[] prqs;
	int totalUnderNode;
	
	public CourseNode(course course){
		parents = new ArrayList<CourseNode>();
		children = new ArrayList<CourseNode>();
		TextId = course.getId();
		position = course.getPosition();
		credit = course.getCredit();
		prqs = course.getPqst().split(";");
		maxIn = -1;
		maxOut = -1;
		totalUnderNode = 0;
		setNumOfPrequisite();
	}
	
	public CourseNode(String textCode_ ,int position_,String[] prqs_, int credit_) {
		parents = new ArrayList<CourseNode>();
		children = new ArrayList<CourseNode>();
		TextId = textCode_;
		position = position_;
		credit = credit_;
		prqs = prqs_;
		maxIn = -1;
		maxOut = -1;
		totalUnderNode = 0;
		setNumOfPrequisite();
		
	}

	public void addParent(CourseNode parent){
		parents.add(parent);
	}
	
	public void addChild(CourseNode child) {
		children.add(child);
		
	}
	
	public void setPrqs(String[] p) {
		prqs = p;
	}
	
	public void setNumOfPrequisite()
	{
		if(prqs[0].equalsIgnoreCase("0")) numOfPrerequisite = 0;
		else numOfPrerequisite = prqs.length;
	}
	public void showProperty() {
		System.out.println("\n\nMM : " + TextId);
		for(String str : prqs) System.out.print( str + "---");
		System.out.print("parent : ");
		for (CourseNode course : parents) {
			System.out.print( course.TextId + " ");
		}
		System.out.print("\nchildren : ");
		for (CourseNode course : children) {
			System.out.print( course.TextId + " ");
		}
		System.out.println("\nNumOfPre : " + numOfPrerequisite);
		System.out.println("Position : "+position);
		System.out.println("Credit : " + credit);
		System.out.println("total under node : " + totalUnderNode);
		System.out.println("MaxOut : " + maxOut);
		System.out.println("MaxIn : "+maxIn);
	}

}
