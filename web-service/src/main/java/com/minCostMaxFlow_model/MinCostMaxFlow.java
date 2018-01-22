package com.minCostMaxFlow_model;

//Min cost max flow algorithm using an adjacency matrix.  If you
//want just regular max flow, setting all edge costs to 1 gives
//running time O(|E|^2 |V|).
//
//Running time: O(min(|V|^2 * totflow, |V|^3 * totcost))
//
//INPUT: cap -- a matrix such that cap[i][j] is the capacity of
//          a directed edge from node i to node j
//
//   cost -- a matrix such that cost[i][j] is the (positive)
//           cost of sending one unit of flow along a 
//           directed edge from node i to node j
//
//   source -- starting node
//   sink -- ending node
//
//OUTPUT: max flow and min cost; the matrix flow will contain
//    the actual flow values (note that unlike in the MaxFlow
//    code, you don't need to ignore negative flow values -- there
//    shouldn't be any)
//
//To use this, create a MinCostMaxFlow object, and call it like this:
//
//MinCostMaxFlow nf;
//int maxflow = nf.getMaxFlow(cap,cost,source,sink);

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

import com.evaluation.SimilarityCompare;
import com.student.course;
import com.student.faculty;
import com.student.student;

/**
 * @author Kin_meow
 *
 */
/**
 * @author Kin_meow
 *
 */
public class MinCostMaxFlow {
	private boolean found[], choose[], isRe[];
	private int N, cap[][], flow[][], dad[];
	private double cost[][];
	private double dist[], pi[];
	

	static final double INF = Integer.MAX_VALUE / 2 - 1;

	public boolean search(int source, int sink) { // check if is there any path
													// from source to sink.
		Arrays.fill(found, false); // haven't found anypath from source.
		Arrays.fill(dist, INF);// at first cost from sourse to any node = max
		dist[source] = 0; // of course cost from source to source = 0;

		while (source != N) { // when haven't reach the last node, still go.
			int best = N;
			found[source] = true; // of course found source-the first node
			for (int k = 0; k < N; k++) {
				// if (!isRe[k]) continue;
				if (found[k])
					continue; // if node k already found, find the next node
				if (flow[k][source] != 0) { // this is the current flow from
											// source to node k
					double val = dist[source] + pi[source] - pi[k] - cost[k][source];
					if (dist[k] > val) {
						dist[k] = val;
						dad[k] = source;
					}
				}
				if (flow[source][k] < cap[source][k]) {
					double val = dist[source] + pi[source] - pi[k] + cost[source][k];
					if (dist[k] > val) {
						dist[k] = val;
						dad[k] = source;
					}
				}

				if (dist[k] < dist[best])
					best = k;
			}
			source = best;
		}

		for (int k = 0; k < N; k++)
			pi[k] = Math.min(pi[k] + dist[k], INF);
		return found[sink];
	}

	
	public boolean[] getMaxFlow(student stu, String namefile) throws IOException {
		this.cap = stu.getCap();
		this.cost = stu.getCost();
		N = cap.length;
		int source = 0;
		int sink = N - 1;
		this.cap = stu.getCap();
		this.cost = stu.getCost();
		String msv = stu.getMSV();
		// this.isRe = isRe;
		BufferedWriter bw = new BufferedWriter(new FileWriter("Data/" + namefile + "/" + stu.getNameFile()));

		found = new boolean[N];
		choose = new boolean[N];
		flow = new int[N][N];
		dist = new double[N + 1];
		dad = new int[N];
		pi = new double[N];

		//
		// for (int i = 0; i <cap.length; i++)
		// {
		// for( int j = 0; j <cap.length; j++) System.out.print(cap[i][j] +
		// ",");
		// System.out.println("");
		// }
		// for( int j = 0; j <cost.length; j++) System.out.print(cost[0][j] +
		// ",");
		//// //---------------------------------------------------------------------//
		//

		Arrays.fill(choose, false);

		int totflow = 0, totcost = 0;
		while (search(source, sink)) {
			double amt = INF;
			for (int x = sink; x != source; x = dad[x])
				amt = Math.min(amt, flow[x][dad[x]] != 0 ? flow[x][dad[x]] : cap[dad[x]][x] - flow[dad[x]][x]);
			for (int x = sink; x != source; x = dad[x]) {
				if (flow[x][dad[x]] != 0) {
					flow[x][dad[x]] -= amt;
					totcost -= amt * cost[x][dad[x]];
				} else {
					flow[dad[x]][x] += amt;
					totcost += amt * cost[dad[x]][x];
				}
			}
			totflow += amt;

			/*
			 * viet vao 1 file gom co MSV ma mon theo thu tu va bang 0 1
			 */
			choose[dad[dad[sink]]] = true;
		}
		// BufferedReader br = new BufferedReader(new
		// FileReader("data/CNTT/GeneralData/MonBoTro_TuChon_CNTT.csv"));
		// String line;
		//
		// while( (line=br.readLine()) != null){
		// String[] values = line.split(",");
		int re1 = 0;
		int re2 = 0;
		List<String> StudiedCourses = stu.getStudiedCourses();

		for (int mamon = 1; mamon <= stu.getFal().getnumberOfCourse(); mamon++) {
			// Integer.parseInt(values[0]);
			String ID = stu.getFal().courses.get(mamon - 1).getId();
			if (StudiedCourses.contains(ID))
				continue;
			if (choose[mamon]) {
				re1 += stu.getFal().courses.get(mamon - 1).getCredit();
				bw.write(stu.getMSV() + "," + stu.getFal().courses.get(mamon - 1).getId() + "," + 1 + "\n");
			} else {
				bw.write(stu.getMSV() + "," + stu.getFal().courses.get(mamon - 1).getId() + "," + 0 + "\n");
			}
		}
		// --------------------------------------------------------------------------------------------------------------------------
		// System.out.println(stu.getNameFile()+ "/" +stu.getMSV()+ "/"+
		// re1+"______________"+stu.total_+"AVG = "+stu.getAVG());
		// for(int mamon = 0; mamon <N; mamon++){ System.out.println(mamon + "-"
		// + choose[mamon]);}

		bw.close();

		// br.close();
		// return new double[]{ totflow, totcost };
		// getMaxFlow(stu.setNewCap(choose));
		return choose.clone();
	}

	public boolean[] getMutipleResult(student stu) throws IOException, CloneNotSupportedException {
		boolean[] choose1 = getMaxFlow(stu, "Result");
		student stu2 = stu.setNewCap(choose1);
		getMaxFlow(stu2, "Result2");
		return choose1;
	}
//	
//	
//	
	public String[] getRecommendedList(student stu) throws IOException {
		ArrayList<String> result  = new ArrayList<String>();
		this.cap = stu.getCap();
		this.cost = stu.getCost();
		N = cap.length;
		int source = 0;
		int sink = N - 1;
		this.cap = stu.getCap();
		this.cost = stu.getCost();
		String msv = stu.getMSV();

		found = new boolean[N];
		choose = new boolean[N];
		flow = new int[N][N];
		dist = new double[N + 1];
		dad = new int[N];
		pi = new double[N];
		Arrays.fill(choose, false);

		int totflow = 0, totcost = 0;
		while (search(source, sink)) {
			double amt = INF;
			for (int x = sink; x != source; x = dad[x])
				amt = Math.min(amt, flow[x][dad[x]] != 0 ? flow[x][dad[x]] : cap[dad[x]][x] - flow[dad[x]][x]);
			for (int x = sink; x != source; x = dad[x]) {
				if (flow[x][dad[x]] != 0) {
					flow[x][dad[x]] -= amt;
					totcost -= amt * cost[x][dad[x]];
				} else {
					flow[dad[x]][x] += amt;
					totcost += amt * cost[dad[x]][x];
				}
			}
			totflow += amt;

			/*
			 * viet vao 1 file gom co MSV ma mon theo thu tu va bang 0 1
			 */
			choose[dad[dad[sink]]] = true;
		}
		int re1 = 0;
		List<String> StudiedCourses = stu.getStudiedCourses();

		for (int mamon = 1; mamon <= stu.getFal().getnumberOfCourse(); mamon++) {
			// Integer.parseInt(values[0]);
			String ID = stu.getFal().courses.get(mamon - 1).getId();
			if (StudiedCourses.contains(ID))
				continue;
			if (choose[mamon]) {
				re1 += stu.getFal().courses.get(mamon - 1).getCredit();
				course selectedCourse = stu.getFal().courses.get(mamon - 1);
				result.add(selectedCourse.getId());
			} 
		}
//		bw.close();
//		stu.setResultToArrangement(choose);
		stu.setResultToArrangement_v2(choose);
		String[] finalResult = new String[result.size()];
		finalResult = result.toArray(finalResult);
		return finalResult;
	}

	
	
	

	
}
