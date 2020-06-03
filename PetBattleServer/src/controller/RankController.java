package controller;

import java.util.ArrayList;
import bean.UserVsRank;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;

@Controller
public class RankController {
	
	public static synchronized void addRank(UserVsRank userVsRank) {
		new Transaction() {
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
	
	public ArrayList<UserVsRank> getRanks() {
		return CURD.select(UserVsRank.class, new SQL(){{
			ORDER_BY("integral DESC");
			ORDER_BY("create_time");
			LIMIT("30");
		}});
	}
}
