package controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import bean.UserEquipment;
import bean.UserInfo;
import bean.UserProp;
import game.Player;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;
import result.RequestResult;
import result.UserEquipmentStarUpResult;
import result.UserEquipmentStrengthUpResult;
import result.UserEquipmentWashResult;

@Controller
public class UserEquipmentController {
	
	public RequestResult equipEquipment(int user_pet_id, int user_equipment_id) {
		RequestResult requestResult = new RequestResult();
		UserEquipment userEquipment = CURD.selectOne(UserEquipment.class, new SQL(){{
			WHERE("id=" + user_equipment_id);
		}});
		if (userEquipment == null) {
			requestResult.setMsg("装备不存在");
		}
		userEquipment.setUser_pet_id(user_pet_id);
		int updateCount = CURD.update(userEquipment);
		if (updateCount == 1) {
			requestResult.setCode(200);
			requestResult.setData(userEquipment);
			requestResult.setMsg("装备成功");
		} else {
			requestResult.setMsg("装备失败");
		}
		return requestResult;
	}
	
	public RequestResult removeEquipment(int user_equipment_id) {
		RequestResult requestResult = new RequestResult();
		UserEquipment userEquipment = CURD.selectOne(UserEquipment.class, new SQL(){{
			WHERE("id=" + user_equipment_id);
		}});
		if (userEquipment == null) {
			requestResult.setMsg("装备不存在");
		}
		userEquipment.setUser_pet_id(0);
		int updateCount = CURD.update(userEquipment);
		if (updateCount == 1) {
			requestResult.setCode(200);
			requestResult.setData(userEquipment);
			requestResult.setMsg("卸下成功");
		} else {
			requestResult.setMsg("卸下失败");
		}
		return requestResult;
	}
	
	public static RequestResult strengthUp(
		Player player, 
		int user_equipment_id, 
		int prop_id,
		int prop_count,
		int coin
	) {
		RequestResult requestResult = new RequestResult();
		UserEquipment userEquipment = CURD.selectOne(UserEquipment.class, new SQL(){{
			WHERE("id=" + PARAM(user_equipment_id));
		}});
		if (userEquipment == null) {
			requestResult.setMsg("装备不存在");
			return requestResult;
		} else {
			UserProp userProp = new UserProp();
			userProp.setUser_id(player.userInfo.getId());
			userProp.setProp_id(prop_id);
			userProp.setAmount(prop_count);
			UserInfo userInfo = (UserInfo) player.userInfo.clone();
			userInfo.setCoin(userInfo.getCoin() - coin);
			if (userInfo.getCoin() < 0) {
				requestResult.setMsg("金币不足");
				return requestResult;
			}
			userEquipment.setStrength_level(userEquipment.getStrength_level() + 1);
			if (userEquipment.getStrength_level() > 15) {
				requestResult.setMsg("强化等级已满");
				return requestResult;
			}
			new Transaction() {
				@Override
				public void run() throws Exception {
					if (UserPropController.subProp(this, userProp, requestResult) && update(userInfo) == 1) {
						update(userEquipment);
						commit();
					}
				}
				@Override
				public void success() {
					player.userInfo = userInfo;
					UserEquipmentStrengthUpResult userEquipmentStrengthUpResult = new UserEquipmentStrengthUpResult();
					userEquipmentStrengthUpResult.setUserInfo(userInfo);
					userEquipmentStrengthUpResult.setUserProp(userProp);
					userEquipmentStrengthUpResult.setUserEquipment(userEquipment);
					requestResult.setData(userEquipmentStrengthUpResult);
					requestResult.setCode(200);
					requestResult.setMsg("强化成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("强化失败");
				}
			};
		}
		return requestResult;
	}
	
	public static RequestResult starUp(
			Player player, 
			int user_equipment_id, 
			int prop_id,
			int prop_count,
			int coin
	) {
		RequestResult requestResult = new RequestResult();
		UserEquipment userEquipment = CURD.selectOne(UserEquipment.class, new SQL(){{
			WHERE("id=" + PARAM(user_equipment_id));
		}});
		if (userEquipment == null) {
			requestResult.setMsg("装备不存在");
			return requestResult;
		} else {
			UserProp userProp = new UserProp();
			userProp.setUser_id(player.userInfo.getId());
			userProp.setProp_id(prop_id);
			userProp.setAmount(prop_count);
			UserInfo userInfo = (UserInfo) player.userInfo.clone();
			userInfo.setCoin(userInfo.getCoin() - coin);
			if (userInfo.getCoin() < 0) {
				requestResult.setMsg("金币不足");
				return requestResult;
			}
			userEquipment.setStar_level(userEquipment.getStar_level() + 1);
			if (userEquipment.getStar_level() > 5) {
				requestResult.setMsg("星痕等级已满");
				return requestResult;
			}
			new Transaction() {
				@Override
				public void run() throws Exception {
					if (UserPropController.subProp(this, userProp, requestResult) && update(userInfo) == 1) {
						update(userEquipment);
						commit();
					}
				}
				@Override
				public void success() {
					player.userInfo = userInfo;
					UserEquipmentStarUpResult userEquipmentStarUpResult = new UserEquipmentStarUpResult();
					userEquipmentStarUpResult.setUserInfo(userInfo);
					userEquipmentStarUpResult.setUserProp(userProp);
					userEquipmentStarUpResult.setUserEquipment(userEquipment);
					requestResult.setData(userEquipmentStarUpResult);
					requestResult.setCode(200);
					requestResult.setMsg("升星成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("升星失败");
				}
			};
		}
		return requestResult;
	}
	
	public static RequestResult wash(
			Player player, 
			int user_equipment_id, 
			int[] prop_ids,
			int[] prop_counts,
			int coin
	) {
		RequestResult requestResult = new RequestResult();
		UserEquipment userEquipment = CURD.selectOne(UserEquipment.class, new SQL(){{
			WHERE("id=" + PARAM(user_equipment_id));
		}});
		if (userEquipment == null) {
			requestResult.setMsg("装备不存在");
			return requestResult;
		} else {
			UserProp[] userProps = new UserProp[prop_ids.length];
			for (int i = 0; i < userProps.length; i++) {
				UserProp userProp = new UserProp();
				userProp.setUser_id(player.userInfo.getId());
				userProp.setProp_id(prop_ids[i]);
				userProp.setAmount(prop_counts[i]);
				userProps[i] = userProp;
			}
			UserInfo userInfo = (UserInfo) player.userInfo.clone();
			userInfo.setCoin(userInfo.getCoin() - coin);
			if (userInfo.getCoin() < 0) {
				requestResult.setMsg("金币不足");
				return requestResult;
			}
			JSONObject viceStatus = JSON.parseObject(userEquipment.getVice_status());
			String[] viceStatusNameList = (String[]) viceStatus.keySet().toArray(new String[viceStatus.keySet().size()]);
			Random random = new Random();
			double rate = 1;
			if (String.valueOf(userEquipment.getEquipment_id()).endsWith("2")) {
				rate = 1.25;
			} else if (String.valueOf(userEquipment.getEquipment_id()).endsWith("3")) {
				rate = 1.5;
			}
			for (String viceStatusName : viceStatusNameList) {
				int[] viceStatusRange = viceStatusRangeMap.get(viceStatusName);
				int viceStatusRangeStart = (int) Math.floor(viceStatusRange[0] * rate);
				int viceStatusRangeEnd = (int) Math.floor(viceStatusRange[1] * rate);
				int viceStatusValue = viceStatusRangeStart + random.nextInt((viceStatusRangeEnd - viceStatusRangeStart + 1));
				viceStatus.put(viceStatusName, viceStatusValue);
			}
			userEquipment.setVice_status(viceStatus.toString());
			new Transaction() {
				@Override
				public void run() throws Exception {
					boolean sub_success = true;
					for (UserProp userProp : userProps) {
						if (!UserPropController.subProp(this, userProp, requestResult)) {
							sub_success = false;
						}
					}
					if (sub_success && update(userInfo) == 1) {
						update(userEquipment);
						commit();
					}
				}
				@Override
				public void success() {
					player.userInfo = userInfo;
					UserEquipmentWashResult userEquipmentWashResult = new UserEquipmentWashResult();
					userEquipmentWashResult.setUserInfo(userInfo);
					userEquipmentWashResult.setUserProps(userProps);
					userEquipmentWashResult.setUserEquipment(userEquipment);
					requestResult.setData(userEquipmentWashResult);
					requestResult.setCode(200);
					requestResult.setMsg("洗炼成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("洗炼失败");
				}
			};
		}
		return requestResult;
	}
	
	public static RequestResult sell(Player player, UserEquipment[] userEquipments) {
		RequestResult requestResult = new RequestResult();
		UserInfo userInfo = (UserInfo) player.userInfo.clone();
		for (UserEquipment userEquipment : userEquipments) {
			String rarity = getEquipmentRarityById(userEquipment.getEquipment_id());
			if (rarity.equals("R")) {
				userInfo.setCoin(userInfo.getCoin() + 1000);
			} else if (rarity.equals("SR")) {
				userInfo.setDiamond(userInfo.getDiamond() + 30);
			} else if (rarity.equals("SSR")) {
				userInfo.setDiamond(userInfo.getDiamond() + 100);
			}
		}
		new Transaction() {
			@Override
			public void run() throws Exception {
				if (update(userInfo) == 1 && delete(userEquipments) == userEquipments.length) {
					commit();
				} else {
					requestResult.setMsg("出售失败");
				}
			}
			@Override
			public void success() {
				player.userInfo = userInfo;
				requestResult.setCode(200);
				requestResult.setData(userInfo);
				requestResult.setMsg("出售成功");
			}
			@Override
			public void fail() {
				requestResult.setMsg("出售失败");
			}
		};
		return requestResult;
	}
	
	public static ArrayList<UserEquipment> getUserEquipments(Player player) {
		return CURD.select(UserEquipment.class, new SQL(){{
			WHERE("user_id=" + player.userInfo.getId());
		}});
	}
	
	public static UserEquipment generateUserEquipment(Transaction transaction, UserEquipment userEquipment) throws Exception {
		createUserEquipment(userEquipment);
		transaction.insertAndGenerateKeys(userEquipment);
		return userEquipment;
	}
	
	public static HashMap<String, int[]> mainStatusRangeMap = new HashMap<String, int[]>();
	public static HashMap<String, int[]> viceStatusRangeMap = new HashMap<String, int[]>();
	public static String[] equipmentNames = new String[] {
		"护目", "手镯", "头饰", "项链", "尖牙", "星石"
	};
	public static String getEquipmentNameById(int id) {
		return equipmentNames[id / 10 - 300];
	}
	public static String getEquipmentRarityById(int id) {
		if (id % 10 == 1) {
			return "R";
		}
		if (id % 10 == 2) {
			return "SR";
		}
		if (id % 10 == 3) {
			return "SSR";
		}
		return null;
	}
	
	public static void init() {
		mainStatusRangeMap.put("hp", new int[] {200, 300});
		mainStatusRangeMap.put("attack", new int[] {30, 50});
		mainStatusRangeMap.put("defend", new int[] {15, 25});
		mainStatusRangeMap.put("speed", new int[] {10, 20});
		mainStatusRangeMap.put("critRate", new int[] {5, 12});
		mainStatusRangeMap.put("critHurt", new int[] {10, 20});
		mainStatusRangeMap.put("hit", new int[] {10, 20});
		mainStatusRangeMap.put("resist", new int[] {10, 20});
		viceStatusRangeMap.put("hp", new int[] {122, 188});
		viceStatusRangeMap.put("attack", new int[] {20, 36});
		viceStatusRangeMap.put("defend", new int[] {10, 18});
		viceStatusRangeMap.put("speed", new int[] {5, 10});
		viceStatusRangeMap.put("critRate", new int[] {5, 10});
		viceStatusRangeMap.put("critHurt", new int[] {10, 20});
		viceStatusRangeMap.put("hit", new int[] {5, 10});
		viceStatusRangeMap.put("resist", new int[] {5, 10});
	}
	
	public static UserEquipment createUserEquipment(UserEquipment userEquipment) {
		String equipmentName = getEquipmentNameById(userEquipment.getEquipment_id());
		String rarity = getEquipmentRarityById(userEquipment.getEquipment_id());
		JSONObject mainStatus = new JSONObject();
		JSONObject viceStatus = new JSONObject();
		Random random = new Random();
		double rate = 1;
		int viceStatusCount = 1;
		int idSequence = 1;
		if (rarity.equals("SR")) {
			rate = 1.25;
			viceStatusCount = 2;
			idSequence = 2;
		} else if (rarity.equals("SSR")) {
			rate = 1.5;
			viceStatusCount = 3;
			idSequence = 3;
		}
		String mainStatusName = null;
		String[] mainStatusNameArr = null;
		if (equipmentName.equals("护目")) {
			mainStatusNameArr = new String[] {"defend", "hit", "resist"};
			userEquipment.setEquipment_id(3000 + idSequence);
		}
		if (equipmentName.equals("手镯")) {
			mainStatusNameArr = new String[] {"attack", "critRate", "critHurt", "speed"};
			userEquipment.setEquipment_id(3010 + idSequence);
		}
		if (equipmentName.equals("头饰")) {
			mainStatusNameArr = new String[] {"defend", "hit", "resist"};
			userEquipment.setEquipment_id(3020 + idSequence);
		}
		if (equipmentName.equals("项链")) {
			mainStatusNameArr = new String[] {"hp", "defend", "resist"};
			userEquipment.setEquipment_id(3030 + idSequence);
		}
		if (equipmentName.equals("尖牙")) {
			mainStatusNameArr = new String[] {"attack", "critRate", "critHurt", "speed"};
			userEquipment.setEquipment_id(3040 + idSequence);
		}
		if (equipmentName.equals("星石")) {
			mainStatusNameArr = new String[] {"hp", "defend", "resist"};
			userEquipment.setEquipment_id(3050 + idSequence);
		}
		mainStatusName = mainStatusNameArr[random.nextInt(mainStatusNameArr.length)];
		int[] mainStatusRange = mainStatusRangeMap.get(mainStatusName);
		int mainStatusRangeStart = (int) Math.floor(mainStatusRange[0] * rate);
		int mainStatusRangeEnd = (int) Math.floor(mainStatusRange[1] * rate);
		int mainStatusValue = mainStatusRangeStart + random.nextInt((mainStatusRangeEnd - mainStatusRangeStart + 1));
		mainStatus.put(mainStatusName, mainStatusValue);
		userEquipment.setMain_status(mainStatus.toString());
		
		ArrayList<String> statusNameList = new ArrayList<>();
		statusNameList.add("hp");
		statusNameList.add("attack");
		statusNameList.add("defend");
		statusNameList.add("speed");
		statusNameList.add("critRate");
		statusNameList.add("critHurt");
		statusNameList.add("hit");
		statusNameList.add("resist");
		ArrayList<String> viceStatusNameList = new ArrayList<>();
		for (int i = 0; i < viceStatusCount; i++) {
			viceStatusNameList.add(statusNameList.remove(random.nextInt(statusNameList.size())));
		}
		for (String viceStatusName : viceStatusNameList) {
			int[] viceStatusRange = viceStatusRangeMap.get(viceStatusName);
			int viceStatusRangeStart = (int) Math.floor(viceStatusRange[0] * rate);
			int viceStatusRangeEnd = (int) Math.floor(viceStatusRange[1] * rate);
			int viceStatusValue = viceStatusRangeStart + random.nextInt((viceStatusRangeEnd - viceStatusRangeStart + 1));
			viceStatus.put(viceStatusName, viceStatusValue);
		}
		userEquipment.setVice_status(viceStatus.toString());
		return userEquipment;
	}
}
