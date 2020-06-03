package bean;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("user_pet")
public class UserPet {
	@Id
	@GeneratedValue
	private int id;
	@Column
	private int user_id;
	@Column
	private int pet_id;
	@Column
	private int pet_level;
	@Column
	private int blood_level;
	@Column
	private int break_level;
	@Column
	private int pet_exp;
	@Column
	private int blood_exp;
	@Column
	private int fragment;
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
	public int getPet_id() {
		return pet_id;
	}
	public void setPet_id(int pet_id) {
		this.pet_id = pet_id;
	}
	public int getPet_level() {
		return pet_level;
	}
	public void setPet_level(int pet_level) {
		this.pet_level = pet_level;
	}
	public int getBlood_level() {
		return blood_level;
	}
	public void setBlood_level(int blood_level) {
		this.blood_level = blood_level;
	}
	public int getBreak_level() {
		return break_level;
	}
	public void setBreak_level(int break_level) {
		this.break_level = break_level;
	}
	public int getPet_exp() {
		return pet_exp;
	}
	public void setPet_exp(int pet_exp) {
		this.pet_exp = pet_exp;
	}
	public int getBlood_exp() {
		return blood_exp;
	}
	public void setBlood_exp(int blood_exp) {
		this.blood_exp = blood_exp;
	}
	public int getFragment() {
		return fragment;
	}
	public void setFragment(int fragment) {
		this.fragment = fragment;
	}
}
