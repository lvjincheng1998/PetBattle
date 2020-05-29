package bean;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("user_equipment")
public class UserEquipment {
	@Id
	@GeneratedValue
	private int id;
	@Column
	private int user_id;
	@Column
	private int equipment_id;
	@Column
	private String main_status;
	@Column
	private String vice_status;
	@Column
	private int strength_level;
	@Column
	private int star_level;
	@Column
	private int user_pet_id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getEquipment_id() {
		return equipment_id;
	}
	public void setEquipment_id(int equipment_id) {
		this.equipment_id = equipment_id;
	}
	public String getMain_status() {
		return main_status;
	}
	public void setMain_status(String main_status) {
		this.main_status = main_status;
	}
	public String getVice_status() {
		return vice_status;
	}
	public void setVice_status(String vice_status) {
		this.vice_status = vice_status;
	}
	public int getStrength_level() {
		return strength_level;
	}
	public void setStrength_level(int strength_level) {
		this.strength_level = strength_level;
	}
	public int getStar_level() {
		return star_level;
	}
	public void setStar_level(int star_level) {
		this.star_level = star_level;
	}
	public int getUser_pet_id() {
		return user_pet_id;
	}
	public void setUser_pet_id(int user_pet_id) {
		this.user_pet_id = user_pet_id;
	}
}
