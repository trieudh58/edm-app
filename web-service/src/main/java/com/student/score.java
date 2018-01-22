/**
 * 
 */
package com.student;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

/**
 * @author Kin_meow
 *
 */
public class score {
	private String ID_course;
	private double score;
	
	public score(String ID_course_, double score_) {
		ID_course = ID_course_;
		score = score_;
	}
	
	public static score[] get_score_list_from_file ( String filename) throws FileNotFoundException
	{
		Scanner input = new Scanner(new FileReader(filename));
		ArrayList<score> scoreList = new ArrayList<score>();
		while( input.hasNext()){
			String line[] = input.nextLine().split(",");
			String ID_course = line[1];
			double score = Double.parseDouble(line[2]);
			scoreList.add(new score(ID_course, score));
		}
		score[] result = new score [scoreList.size()];
		return scoreList.toArray(result);
	}
	/**
	 * @return the iD_course
	 */
	public String getID_course() {
		return ID_course;
	}
	/**
	 * @param iD_course the iD_course to set
	 */
	public void setID_course(String iD_course) {
		ID_course = iD_course;
	}
	/**
	 * @return the score
	 */
	public double getScore() {
		return score;
	}
	/**
	 * @param score the score to set
	 */
	public void setScore(double score) {
		this.score = score;
	}
}
