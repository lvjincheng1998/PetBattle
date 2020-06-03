package controller;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import bean.ShopGoods;
import bean.UserEquipment;
import bean.UserInfo;
import bean.UserPet;
import bean.UserProp;
import game.Player;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;
import result.BuyGoodsResult;
import result.RequestResult;
import result.ShopGoodsResult;

@Controller
public class ShopController {
	static List<ShopGoods> goodsList = null;
	static long nextRefreshTime = 0;
	
	public static void init() {
		refresh();
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				timer.cancel();
				init();
			}
		}, new Date(nextRefreshTime));
	}
	
	public static void refresh() {
		int interval = 3 * 60 * 60;
		List<ShopGoods> total_list = CURD.selectAll(ShopGoods.class);
		total_list.sort(new Comparator<ShopGoods>() {
			@Override
			public int compare(ShopGoods o1, ShopGoods o2) {
				return o1.getGoods_id() - o2.getGoods_id();
			}
		});
//		List<ShopGoods> actual_list = new ArrayList<>();
//		Random random = new Random();
//		for (int i = 0; i < 10; i++) {
//			int index = random.nextInt(total_list.size());
//			ShopGoods goods = total_list.remove(index);
//			goods.setUuid(UUID.randomUUID().toString().replace("-", ""));
//			actual_list.add(goods);
//		}
//		goodsList = actual_list;
		for (ShopGoods goods: total_list) {
			goods.setUuid(UUID.randomUUID().toString().replace("-", ""));
		}
		goodsList = total_list;
		nextRefreshTime = System.currentTimeMillis() + interval * 1000;
	}
	
	public static RequestResult getGoodsList() {
		ShopGoodsResult shopGoodsResult = new ShopGoodsResult();
		shopGoodsResult.setNextRefreshTime(nextRefreshTime);
		shopGoodsResult.setGoodsList(goodsList);
		RequestResult requestResult = new RequestResult();
		requestResult.setData(shopGoodsResult);
		requestResult.setCode(200);
		requestResult.setMsg("获取成功");
		return requestResult;
	}
	
	public static ShopGoods getGoods(int goods_id) {
		for (ShopGoods shopGoods : goodsList) {
			if (shopGoods.getGoods_id() == goods_id) {
				return shopGoods;
			}
		}
		return null;
	}
	
	public static synchronized RequestResult buyGoods(Player player, String uuid) {
		RequestResult requestResult = new RequestResult();
		ShopGoods tempShopGoods = null;
		for (ShopGoods goods : goodsList) {
			if (goods.getUuid().equals(uuid)) {
				tempShopGoods = goods;
				break;
			}
		}
		ShopGoods shopGoods = tempShopGoods;
		if (shopGoods == null) {
			requestResult.setMsg("该商品不存在");
			return requestResult;
		}
		if (shopGoods.getHas_buy() >= shopGoods.getMax_buy()) {
			requestResult.setMsg("该商品已售空");
			return requestResult;
		}
		UserInfo userInfo = (UserInfo) player.userInfo.clone();
		if (shopGoods.getCurrency().equals("coin")) {
			if (shopGoods.getPrice() > userInfo.getCoin()) {
				requestResult.setMsg("金币不足");
				return requestResult;
			} else {
				userInfo.setCoin(userInfo.getCoin() - shopGoods.getPrice());
			}
		} else if (shopGoods.getCurrency().equals("diamond")) {
			if (shopGoods.getPrice() > userInfo.getDiamond()) {
				requestResult.setMsg("钻石不足");
				return requestResult;
			} else {
				userInfo.setDiamond(userInfo.getDiamond() - shopGoods.getPrice());
			}
		}
		UserProp userProp = new UserProp();
		userProp.setUser_id(userInfo.getId());
		userProp.setProp_id(shopGoods.getGoods_id());
		userProp.setAmount(shopGoods.getSingle_buy());
		UserPet userPet = CURD.selectOne(UserPet.class, new SQL(){{
			WHERE("user_id=" + PARAM(userInfo.getId()));
			WHERE("pet_id=" + PARAM(shopGoods.getGoods_id()));
		}});
		if (userPet == null) {
			userPet = new UserPet();
			userPet.setUser_id(userInfo.getId());
			userPet.setPet_id(shopGoods.getGoods_id());
		} else {
			userPet.setFragment(userPet.getFragment() + 1);
		}
		UserPet userPet_new = userPet;
		UserEquipment userEquipment = new UserEquipment();
		userEquipment.setUser_id(userInfo.getId());
		userEquipment.setEquipment_id(shopGoods.getGoods_id());
		BuyGoodsResult buyGoodsResult = new BuyGoodsResult();
		buyGoodsResult.setUserInfo(userInfo);
		buyGoodsResult.setGoods_type(shopGoods.getGoods_type());
		new Transaction() {
			@Override
			public void run() throws Exception {
				update(userInfo);
				if (shopGoods.getGoods_type().equals("pet")) {
					if (userPet_new.getId() == 0) {
						insertAndGenerateKeys(userPet_new);
					} else {
						update(userPet_new);
					}
					buyGoodsResult.setUserGoods(userPet_new);
				} else if (shopGoods.getGoods_type().equals("prop")) {
					UserPropController.addProp(this, userProp, requestResult);
					buyGoodsResult.setUserGoods(userProp);
				} else if (shopGoods.getGoods_type().equals("equipment")) {
					UserEquipmentController.generateUserEquipment(this, userEquipment);
					buyGoodsResult.setUserGoods(userEquipment);
				}
				commit();
			}
			@Override
			public void success() {
				player.userInfo = userInfo;
				shopGoods.setHas_buy(shopGoods.getHas_buy() + 1);
				requestResult.setCode(200);
				requestResult.setData(buyGoodsResult);
				requestResult.setMsg("购买成功");
			}
			@Override
			public void fail() {
				requestResult.setMsg("购买失败");
			}
		};
		return requestResult;
	}
}
