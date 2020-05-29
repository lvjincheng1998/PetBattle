package result;

import java.util.ArrayList;
import java.util.Arrays;

public class BattleVsResult {
	private String res;
	private ArrayList<Integer> sideIndexes = new ArrayList<Integer>();
	private ArrayList<Integer> integrals = new ArrayList<Integer>();;
	private ArrayList<Integer> integralVars = new ArrayList<Integer>();
	public String getRes() {
		return res;
	}
	public void setRes(String res) {
		this.res = res;
	}
	public ArrayList<Integer> getSideIndexes() {
		return sideIndexes;
	}
	public void setSideIndexes(ArrayList<Integer> sideIndexes) {
		this.sideIndexes = sideIndexes;
	}
	public ArrayList<Integer> getIntegrals() {
		return integrals;
	}
	public void setIntegrals(ArrayList<Integer> integrals) {
		this.integrals = integrals;
	}
	public ArrayList<Integer> getIntegralVars() {
		return integralVars;
	}
	public void setIntegralVars(ArrayList<Integer> integralVars) {
		this.integralVars = integralVars;
	}
	public void addSideIndex(Integer... sideIndex) {
		sideIndexes.addAll(Arrays.asList(sideIndex));
	}
	public void addIntegral(Integer... integral) {
		integrals.addAll(Arrays.asList(integral));
	}
	public void addIntegralVar(Integer... integralVar) {
		integralVars.addAll(Arrays.asList(integralVar));
	}
}
