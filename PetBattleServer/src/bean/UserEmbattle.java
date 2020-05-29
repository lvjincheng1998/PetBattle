package bean;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("user_embattle")
public class UserEmbattle {
	@Id
	@GeneratedValue
	private int id;
	@Column
	private int user_id;
	@Column
	private int user_pet_id;
	@Column
	private int sequence_id;
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
	public int getUser_pet_id() {
		return user_pet_id;
	}
	public void setUser_pet_id(int user_pet_id) {
		this.user_pet_id = user_pet_id;
	}
	public int getSequence_id() {
		return sequence_id;
	}
	public void setSequence_id(int sequence_id) {
		this.sequence_id = sequence_id;
	}
}
