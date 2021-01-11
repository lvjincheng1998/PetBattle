package game;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import bean.UserInfo;
import bean.UserVsRank;
import pers.jc.engine.JCEntity;
import pers.jc.network.SocketFunction;
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
			PlayerMgr.remove(this);
			JCLogger.info("(ID:" + userInfo.getId() + ")[" + userInfo.getNickname() + "]ÍË³öÓÎÏ·");
		}
	}
	
	@SocketFunction
	public void start() {
		battleMgr.start();
	}
	
	@SocketFunction
	public void skill(Integer petIndex) {
		skillPetIndex = petIndex;
	}
	
	@SocketFunction
	public void setRes(JSONArray res, JSONObject userVsRank) {
		battleMgr.setRes(this, res, userVsRank.toJavaObject(UserVsRank.class));
	}
}
