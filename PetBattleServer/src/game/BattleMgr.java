package game;

import java.util.ArrayList;
import java.util.Random;
import com.alibaba.fastjson.JSONArray;

import bean.UserVsRank;
import controller.RankController;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.util.JCInterval;
import result.BattleVsResult;

@Controller
public class BattleMgr {
	static ArrayList<Player> matchingList = new ArrayList<Player>();
	Player player1;
	Player player2;
	JSONArray res1 = null;
	JSONArray res2 = null;
	Random random = new Random();
	JCInterval interval;
	
	private static String lockMatch = "lockMatch";
	
	public static void init() {
		new JCInterval(1) {
			@Override
			public void run() {
				synchronized (lockMatch) {
					long now = System.currentTimeMillis();
					for (int i = matchingList.size() - 1; i >= 0; i--) {
						Player player = matchingList.get(i);
						if (player.isValid) {
							if (now - player.matchStartTime >= 5 * 1000) {
								matchingList.remove(i);
								new BattleMgr().matchSuccess(player, player);
							}
						} else {
							matchingList.remove(i);
						}
					}
				}
			}
		};
	}
	
	public static void match(Player player, JSONArray embattle) {
		synchronized (lockMatch) {
			player.embattle = embattle;
			player.matchStartTime = System.currentTimeMillis();
			
			Player matchPlayer = null;
			for (int i = 0; i < matchingList.size(); i++) {
				Player matchingPlayer = matchingList.get(i);
				if (!matchingPlayer.isValid) {
					continue;
				}
				if (Math.abs(
						player.userInfo.getIntegral() - 
						matchingPlayer.userInfo.getIntegral()
					) <= 100
				) {
					matchPlayer = matchingPlayer;
					matchingList.remove(i);
				}
			}
			
			if (matchPlayer == null) {
				matchingList.add(player);
				return;
			}
			
			new BattleMgr().matchSuccess(matchPlayer, player);
		}
	}
	
	private void matchSuccess(Player p1, Player p2) {
		player1 = p1;
		player2 = p2;
		player1.battleMgr = this;
		player2.battleMgr = this;
		player1.call("matchSuccess", player2.userInfo, player2.embattle, 0);
		if (otherIsBot()) {
			return;
		}
		player2.call("matchSuccess", player1.userInfo, player1.embattle, 1);
	}
	
	int readyState = 0;
	
	public synchronized void start() {
		readyState++;
		if (readyState == 2) {
			openFrameSync();
		}
	}
	
	private void openFrameSync() {
		player1.call("setFrameRate", 30);
		player2.call("setFrameRate", 30);
		interval = new JCInterval(0.033) {
			@Override
			public void run() {
				if (!player1.isValid && !player2.isValid) {
					cancel();
				} else {
					step();
				}
			}
		};
	}
	
	private void step() {
		int seed1 = random.nextInt(100);
		int seed2 = random.nextInt(100);
		int[] skillPetIndexes = null;
		if (player1.skillPetIndex > -1 && player2.skillPetIndex > -1) {
			if (random.nextInt(100) < 50) {
				skillPetIndexes = new int[] {player1.skillPetIndex, player2.skillPetIndex};
			} else {
				skillPetIndexes = new int[] {player2.skillPetIndex, player1.skillPetIndex};
			}
		} else if (player1.skillPetIndex > -1) {
			skillPetIndexes = new int[] {player1.skillPetIndex};
		} else if (player2.skillPetIndex > -1) {
			skillPetIndexes = new int[] {player2.skillPetIndex};
		} else {
			skillPetIndexes = new int[] {};
		}
		player1.skillPetIndex = -1;
		player2.skillPetIndex = -1;
		player1.call("step", seed1, seed2, skillPetIndexes);
		player2.call("step", seed1, seed2, skillPetIndexes);
	}
	
	public synchronized void setRes(Player player, JSONArray res, UserVsRank userVsRank) {
		player.userVsRank = userVsRank;
		if (otherIsBot()) {
			res1 = res;
			res2 = res;
		}
		if (player == player1) {
			res1 = res;
			if (!player2.isValid) {
				if (interval != null) {
					interval.cancel();
				}
				calculateIntegral(res);
				return;
			}
		}
		if (player == player2) {
			res2 = res;
			if (!player1.isValid) {
				if (interval != null) {
					interval.cancel();
				}
				calculateIntegral(res);
				return;
			}
		}
		if (res1 != null && res2 != null) {
			if (interval != null) {
				interval.cancel();
			}
			if (
				res1.getInteger(0) == res2.getInteger(0) && 
				res1.getInteger(1) == res2.getInteger(1)
			) {
				calculateIntegral(res);
			} else {
				calculateIntegral(JSONArray.parseArray("[0, 0]"));
			}
			return;
		}
	}
	
	public void calculateIntegral(JSONArray res) {
		BattleVsResult battleVsResult = new BattleVsResult();
		boolean changed = true;
		if (res.getInteger(0) > 0) {
			int integral = 15 + (player2.userInfo.getIntegral() - player1.userInfo.getIntegral()) / 10;
			player1.userInfo.setIntegral(player1.userInfo.getIntegral() + integral);
			if (otherIsPlayer()) {
				player2.userInfo.setIntegral(player2.userInfo.getIntegral() - integral);
			}
			battleVsResult.setRes("»÷°Ü");
			battleVsResult.addSideIndex(0, 1);
			battleVsResult.addIntegral(player1.userInfo.getIntegral(), player2.userInfo.getIntegral());
			battleVsResult.addIntegralVar(integral, -integral);
		} else if (res.getInteger(1) > 0) {
			int integral = 15 + (player1.userInfo.getIntegral() - player2.userInfo.getIntegral()) / 10;
			player1.userInfo.setIntegral(player1.userInfo.getIntegral() - integral);
			if (otherIsPlayer()) {
				player2.userInfo.setIntegral(player2.userInfo.getIntegral() + integral);
			}
			battleVsResult.setRes("»÷°Ü");
			battleVsResult.addSideIndex(1, 0);
			battleVsResult.addIntegral(player2.userInfo.getIntegral(), player1.userInfo.getIntegral());
			battleVsResult.addIntegralVar(integral, -integral);
		} else {
			changed = false;
			battleVsResult.setRes("Æ½¾Ö");
			battleVsResult.addSideIndex(0, 1);
			battleVsResult.addIntegral(player1.userInfo.getIntegral(), player2.userInfo.getIntegral());
			battleVsResult.addIntegralVar(0, 0);
		}
		player1.call("showRes", battleVsResult);
		player1.call("updateUserInfo", player1.userInfo);
		if (otherIsPlayer()) {
			player2.call("showRes", battleVsResult);
			player2.call("updateUserInfo", player2.userInfo);
		}
		if (changed) {
			player1.userVsRank.setIntegral(player1.userInfo.getIntegral());
			setUserVsRank(player1.userVsRank);
			CURD.update(player1.userInfo);
			if (otherIsPlayer()) {
				player2.userVsRank.setIntegral(player2.userInfo.getIntegral());
				setUserVsRank(player2.userVsRank);
				CURD.update(player2.userInfo);
			}
		}
	}
	
	public void setUserVsRank(UserVsRank userVsRank) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				RankController.addRank(userVsRank);
			}
		}).start();
	}
	
	public boolean otherIsBot() {
		return player1.userInfo.getId() == player2.userInfo.getId();
	}
	
	public boolean otherIsPlayer() {
		return player1.userInfo.getId() != player2.userInfo.getId();
	}
}
