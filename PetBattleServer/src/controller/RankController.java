package controller;

import java.util.ArrayList;

import bean.UserVsRank;
import game.DB;
import pers.jc.network.SocketComponent;
import pers.jc.network.SocketMethod;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;

@SocketComponent("RankController")
public class RankController {
	
	@SocketMethod
	public static synchronized void addRank(UserVsRank userVsRank) {
		new Transaction(DB.curd.getAccess()) {
			@Override
			public void run() throws Exception {
				delete(new SQL() {{
					DELETE_FROM(UserVsRank.class);
					WHERE("user_id=" + PARAM(userVsRank.getUser_id()));
				}});
				insert(userVsRank);
				commit();
			}
		};
	}
	
	@SocketMethod
	public ArrayList<UserVsRank> getRanks() {
		return DB.curd.select(UserVsRank.class, new SQL(){{
			ORDER_BY("integral DESC");
			ORDER_BY("create_time");
			LIMIT("30");
		}});
	}
}
