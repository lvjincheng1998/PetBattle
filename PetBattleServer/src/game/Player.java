package game;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import bean.UserInfo;
import bean.UserVsRank;
import pers.jc.engine.JCEntity;
import pers.jc.engine.JCManager;
import pers.jc.util.JCLogger;

public class Player extends JCEntity {
	public UserInfo userInfo;
	public JSONArray embattle;
	public int skillPetIndex = -1;
	public long matchStartTime;
	public BattleMgr battleMgr;
	public UserVsRank userVsRank;
	
	public void onDestroy() {
		if (userInfo != null) {
			JCManager.removeEntity(this);
			JCLogger.info("(ID:" + userInfo.getId() + ")[" + userInfo.getNickname() + "]ÍË³öÓÎÏ·");
		}
	}
	
	public void start() {
		battleMgr.start();
	}
	
	public void skill(Integer petIndex) {
		skillPetIndex = petIndex;
	}
	
	public void setRes(JSONArray res, JSONObject userVsRank) {
		battleMgr.setRes(this, res, userVsRank.toJavaObject(UserVsRank.class));
	}
}
