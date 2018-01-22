/**
 * 
 */
package com.student;

public class course {
	private String id;					// MA mon hoc cua course trong file khung chuong trinh
	private int STT;				// STT <--> index [0][STT] trong cap[][] va cost[][] 
	//private String courseId;		// Ma Mon Hoc - bang chu - VD: INT3110
	private String courseName;		// Ten Mon Hoc
	private int credit;				// So tin chi
	private int requirement_ID;		// ID cua 'require' tuong ung
	private double score;			// Diem ghi nhan cua mon hoc nay
	
	private String pqst;
	private int position;
	private int id_khung;
	private boolean is_optional; 
	
	
	
	public course(int STT_,String id_, String courseName_ , int credit_ , int require_ ,String pqst_,int position_,boolean is_op, int id_khung_ )
	{
		setSTT(STT_);
		id = id_;
		courseName = courseName_;
		credit = credit_;
		requirement_ID = require_;
		pqst = pqst_;
		position = position_;
		setIs_optional(is_op);
		id_khung = id_khung_;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public int getCredit() {
		return credit;
	}
	public void setCredit(int credit) {
		this.credit = credit;
	}
	public int getRequirement_ID() {
		return requirement_ID;
	}
	public void setRequirement_ID(int requirement) {
		this.requirement_ID = requirement;
	}




	/**
	 * @return the sTT
	 */
	public int getSTT() {
		return STT;
	}

	/**
	 * @param sTT the sTT to set
	 */
	public void setSTT(int sTT) {
		STT = sTT;
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

	/**
	 * @return the pqst
	 */
	public String getPqst() {
		return pqst;
	}

	/**
	 * @param pqst the pqst to set
	 */
	public void setPqst(String pqst) {
		this.pqst = pqst;
	}

	/**
	 * @return the position
	 */
	public int getPosition() {
		return position;
	}

	/**
	 * @param position the position to set
	 */
	public void setPosition(int position) {
		this.position = position;
	}

	/**
	 * @return the id_khung
	 */
	public int getId_khung() {
		return id_khung;
	}

	/**
	 * @param id_khung the id_khung to set
	 */
	public void setId_khung(int id_khung) {
		this.id_khung = id_khung;
	}

	/**
	 * @return the is_optional
	 */
	public boolean isIs_optional() {
		return is_optional;
	}

	/**
	 * @param is_optional the is_optional to set
	 */
	public void setIs_optional(boolean is_optional) {
		this.is_optional = is_optional;
	}
}
