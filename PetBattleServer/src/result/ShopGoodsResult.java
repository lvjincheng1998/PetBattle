package result;

import java.util.List;

import bean.ShopGoods;

public class ShopGoodsResult {
	private long nextRefreshTime;
	private List<ShopGoods> goodsList;
	public long getNextRefreshTime() {
		return nextRefreshTime;
	}
	public void setNextRefreshTime(long nextRefreshTime) {
		this.nextRefreshTime = nextRefreshTime;
	}
	public List<ShopGoods> getGoodsList() {
		return goodsList;
	}
	public void setGoodsList(List<ShopGoods> goodsList) {
		this.goodsList = goodsList;
	}
}
