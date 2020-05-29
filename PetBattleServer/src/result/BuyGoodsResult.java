package result;

import bean.UserInfo;

public class BuyGoodsResult {
	private UserInfo userInfo;
	private Object userGoods;
	private String goods_type;
	public UserInfo getUserInfo() {
		return userInfo;
	}
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	public Object getUserGoods() {
		return userGoods;
	}
	public void setUserGoods(Object userGoods) {
		this.userGoods = userGoods;
	}
	public String getGoods_type() {
		return goods_type;
	}
	public void setGoods_type(String goods_type) {
		this.goods_type = goods_type;
	}
}
