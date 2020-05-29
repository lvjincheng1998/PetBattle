package bean;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("shop_goods")
public class ShopGoods {
	@Id
	@GeneratedValue
	private int id;
	@Column
	private int goods_id;
	@Column
	private String goods_type;
	@Column
	private String currency;
	@Column
	private int price;
	@Column
	private int single_buy;
	@Column
	private int max_buy;
	private int has_buy;
	private String uuid;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getGoods_id() {
		return goods_id;
	}
	public void setGoods_id(int goods_id) {
		this.goods_id = goods_id;
	}
	public String getGoods_type() {
		return goods_type;
	}
	public void setGoods_type(String goods_type) {
		this.goods_type = goods_type;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getSingle_buy() {
		return single_buy;
	}
	public void setSingle_buy(int single_buy) {
		this.single_buy = single_buy;
	}
	public int getMax_buy() {
		return max_buy;
	}
	public void setMax_buy(int max_buy) {
		this.max_buy = max_buy;
	}
	public int getHas_buy() {
		return has_buy;
	}
	public void setHas_buy(int has_buy) {
		this.has_buy = has_buy;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
}
