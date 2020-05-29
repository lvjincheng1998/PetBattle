package result;

import java.util.ArrayList;

import bean.UserVsRank;

public class RankResult {
	private ArrayList<UserVsRank> ranks;
	private UserVsRank myRank;
	public ArrayList<UserVsRank> getRanks() {
		return ranks;
	}
	public void setRanks(ArrayList<UserVsRank> ranks) {
		this.ranks = ranks;
	}
	public UserVsRank getMyRank() {
		return myRank;
	}
	public void setMyRank(UserVsRank myRank) {
		this.myRank = myRank;
	}
}
