package controller;

import java.util.ArrayList;
import java.util.Random;
import bean.UserInfo;
import bean.UserPet;
import bean.UserProp;
import game.DB;
import game.Player;
import pers.jc.network.SocketComponent;
import pers.jc.network.SocketMethod;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;
import result.RequestResult;
import result.UserPetBloodUpResult;
import result.UserPetBreakUpResult;
import result.UserPetLevelUpResult;

@SocketComponent("UserPetController")
public class UserPetController {
	
	@SocketMethod
	public RequestResult getUserPets(Player player) {
		ArrayList<UserPet> list = DB.curd.select(UserPet.class, new SQL(){{
			WHERE("user_id=" + PARAM(player.id));
		}});
		RequestResult requestResult = new RequestResult();
		requestResult.setCode(200);
		requestResult.setData(list);
		requestResult.setMsg("获取成功");
		return requestResult;
	}
	
	@SocketMethod
	public RequestResult levelUp(Player player, int user_pet_id, int prop_id) {
		RequestResult requestResult = new RequestResult();
		UserPet userPet = DB.curd.selectOne(UserPet.class, new SQL(){{
			WHERE("id=" + user_pet_id);
		}});
		if (userPet == null) {
			requestResult.setMsg("精灵不存在");
		} else {
			int exp = 0;
			if (prop_id == 1001) {
				exp = 100;
			} else if (prop_id == 1002) {
				exp = 1000;
			} else if (prop_id == 1003) {
				exp = 10000;
			} else if (prop_id == 1004) {
				exp = 100000;
			}
			userPet.setPet_exp(userPet.getPet_exp() + exp);
			int levelExp = 0;
			for (int i = 1; i <= 100; i++) {
				int levelExpNext = levelExp + i * 100;
	            if (userPet.getPet_exp() >= levelExpNext) {
	                userPet.setPet_level(i);
	                levelExp = levelExpNext;
	            }
	        }
			UserProp userProp = new UserProp();
			userProp.setUser_id(player.userInfo.getId());
			userProp.setProp_id(prop_id);
			userProp.setAmount(1);
			new Transaction(DB.curd.getAccess()) {
				@Override
				public void run() throws Exception {
					if (UserPropController.subProp(this, userProp, requestResult)) {
						update(userPet);
						commit();
					}
				}
				@Override
				public void success() {
					UserPetLevelUpResult userPetLevelUpResult = new UserPetLevelUpResult();
					userPetLevelUpResult.setUserPet(userPet);
					userPetLevelUpResult.setUserProp(userProp);
					requestResult.setData(userPetLevelUpResult);
					requestResult.setCode(200);
					requestResult.setMsg("升级成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("升级失败");
				}
			};
		}
		return requestResult;
	}
	
	@SocketMethod
	public RequestResult bloodUp(Player player, int user_pet_id) {
		RequestResult requestResult = new RequestResult();
		UserPet userPet = DB.curd.selectOne(UserPet.class, new SQL(){{
			WHERE("id=" + user_pet_id);
		}});
		if (userPet == null) {
			requestResult.setMsg("精灵不存在");
		} else {
			int bloodExpMax = (userPet.getBlood_level() + 1) * 10;
			int bloodExpCurrent = userPet.getBlood_exp() + 3;
			int bloodExpSurplus = 0;
			boolean bloodUp = false;
			if (bloodExpCurrent >= bloodExpMax) {
				bloodUp = true;
				bloodExpSurplus = bloodExpCurrent - bloodExpMax;
			} else {
				Random random = new Random();
				if (random.nextInt(bloodExpMax) < bloodExpCurrent / 20) {
					bloodUp = true;
					bloodExpSurplus = 0;
				}
			}
			if (bloodUp) {
				userPet.setBlood_level(userPet.getBlood_level() + 1);
				userPet.setBlood_exp(bloodExpSurplus);
			} else {
				userPet.setBlood_exp(bloodExpCurrent);
			}
			UserProp userProp = new UserProp();
			userProp.setUser_id(player.userInfo.getId());
			userProp.setProp_id(1011);
			userProp.setAmount(1);
			new Transaction(DB.curd.getAccess()) {
				@Override
				public void run() throws Exception {
					if (UserPropController.subProp(this, userProp, requestResult)) {
						update(userPet);
						commit();
					}
				}
				@Override
				public void success() {
					UserPetBloodUpResult userPetBloodUpResult = new UserPetBloodUpResult();
					userPetBloodUpResult.setUserPet(userPet);
					userPetBloodUpResult.setUserProp(userProp);
					requestResult.setData(userPetBloodUpResult);
					requestResult.setCode(200);
					requestResult.setMsg("培养成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("培养失败");
				}
			};
		}
		return requestResult;
	}
	
	@SocketMethod
	public RequestResult breakUp(Player player, int user_pet_id) {
		RequestResult requestResult = new RequestResult();
		UserPet userPet = DB.curd.selectOne(UserPet.class, new SQL(){{
			WHERE("id=" + user_pet_id);
		}});
		if (userPet == null) {
			requestResult.setMsg("精灵不存在");
		} else if (userPet.getFragment() <= 0) {
			requestResult.setMsg("精灵碎片不足");
		} else {
			userPet.setFragment(userPet.getFragment() - 1);
			UserInfo userInfo = (UserInfo) player.userInfo.clone();
			userInfo.setCoin(userInfo.getCoin() - (userPet.getBreak_level() + 1) * 10000);
			UserProp userProp = new UserProp();
			userProp.setUser_id(player.userInfo.getId());
			userProp.setProp_id(1021);
			userProp.setAmount(userPet.getBreak_level() + 1);
			userPet.setBreak_level(userPet.getBreak_level() + 1);
			new Transaction(DB.curd.getAccess()) {
				@Override
				public void run() throws Exception {
					if (
						update(userInfo) == 1 &&
						UserPropController.subProp(this, userProp, requestResult)
					) {
						update(userPet);
						commit();
					}
				}
				@Override
				public void success() {
					player.userInfo = userInfo;
					UserPetBreakUpResult userPetBreakUpResult = new UserPetBreakUpResult();
					userPetBreakUpResult.setUserInfo(userInfo);
					userPetBreakUpResult.setUserPet(userPet);
					userPetBreakUpResult.setUserProp(userProp);
					requestResult.setData(userPetBreakUpResult);
					requestResult.setCode(200);
					requestResult.setMsg("突破成功");
				}
				@Override
				public void fail() {
					requestResult.setMsg("突破失败");
				}
			};
		}
		return requestResult;
	}
}
