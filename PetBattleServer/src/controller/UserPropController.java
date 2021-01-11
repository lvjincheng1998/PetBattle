package controller;

import java.util.List;

import bean.ShopGoods;
import bean.UserInfo;
import bean.UserProp;
import game.DB;
import game.Player;
import pers.jc.network.SocketComponent;
import pers.jc.network.SocketMethod;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;
import result.RequestResult;

@SocketComponent("UserPropController")
public class UserPropController {

	@SocketMethod
	public List<UserProp> getProps(Player player) {
		return DB.curd.select(UserProp.class, new SQL(){{
			WHERE("user_id=" + player.userInfo.getId());
		}});
	}
	
	@SocketMethod
	public static RequestResult sell(Player player, UserProp[] userProps) {
		RequestResult requestResult = new RequestResult();
		UserInfo userInfo = (UserInfo) player.userInfo.clone();
		for (UserProp userProp : userProps) {
			ShopGoods shopGoods = ShopController.getGoods(userProp.getProp_id());
			int single_price = shopGoods.getPrice() / shopGoods.getSingle_buy();
			int sell_price = single_price * 3 / 10;
			if (shopGoods.getCurrency().equals("coin")) {
				userInfo.setCoin(userInfo.getCoin() + sell_price * userProp.getAmount());
			} else if (shopGoods.getCurrency().equals("diamond")) {
				userInfo.setDiamond(userInfo.getDiamond() + sell_price * userProp.getAmount());
			}
		}
		new Transaction(DB.curd.getAccess()) {
			@Override
			public void run() throws Exception {
				if (update(userInfo) == 1) {
					int subCount = 0;
					for (UserProp userProp : userProps) {
						if (subProp(this, userProp, requestResult)) {
							subCount++;
						};
					}
					if (subCount == userProps.length) {
						commit();
					} else {
						requestResult.setMsg("出售失败");
					}
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
	
	@SocketMethod
	public static boolean addProp(Transaction transaction, UserProp prop, RequestResult requestResult) throws Exception {
		UserProp userProp = DB.curd.selectOne(UserProp.class, new SQL(){{
			WHERE("user_id=" + prop.getUser_id());
			WHERE("prop_id=" + prop.getProp_id());
		}});
		if (userProp == null) {
			transaction.insertAndGenerateKeys(prop);
			if (prop.getId() > 0) {
				return true;
			}
		} else {
			prop.setId(userProp.getId());
			prop.setAmount(prop.getAmount() + userProp.getAmount());
			if (transaction.update(prop) == 1) {
				return true;
			}
		}
		requestResult.setMsg("获得道具失败");
		return false;
	}
	
	@SocketMethod
	public static boolean subProp(Transaction transaction, UserProp prop, RequestResult requestResult) throws Exception {
		UserProp userProp = DB.curd.selectOne(UserProp.class, new SQL(){{
			WHERE("user_id=" + prop.getUser_id());
			WHERE("prop_id=" + prop.getProp_id());
		}});
		if (userProp == null) {
			requestResult.setMsg("道具不存在");
			return false;
		}
		if (userProp.getAmount() < prop.getAmount()) {
			requestResult.setMsg("道具数量不足");
			return false;
		}
		prop.setId(userProp.getId());
		prop.setAmount(userProp.getAmount() - prop.getAmount());
		if (prop.getAmount() == 0) {
			if (transaction.delete(prop) == 1) {
				return true;
			} else{
				requestResult.setMsg("删除道具失败");
			}
		} else {
			if (transaction.update(prop) == 1) {
				return true;
			} else {
				requestResult.setMsg("更新道具失败");
			}
		}
		return false;
	}
}
