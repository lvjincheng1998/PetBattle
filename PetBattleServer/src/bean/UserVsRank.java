package bean;

import java.sql.Timestamp;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("user_vs_rank")
public class UserVsRank {
	@Id
	@GeneratedValue
	private int id;
	@Column
	private int user_id;
	@Column
	private String nickname;
	@Column
	private String avatarUrl;
	@Column
	private String pet_ids;
	@Column
	private String pet_levels;
	@Column
	private int strength;
	@Column
	private int integral;
	@Column
	private Timestamp create_time = new Timestamp(System.currentTimeMillis());
	
	public UserVsRank() {}
	
	public UserVsRank(int user_id, String nickname, String avatarUrl, String pet_ids, String pet_levels, int strength,
			int integral) {
		this.user_id = user_id;
		this.nickname = nickname;
		this.avatarUrl = avatarUrl;
		this.pet_ids = pet_ids;
		this.pet_levels = pet_levels;
		this.strength = strength;
		this.integral = integral;
	}
	
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
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getAvatarUrl() {
		return avatarUrl;
	}
	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}
	public String getPet_ids() {
		return pet_ids;
	}
	public void setPet_ids(String pet_ids) {
		this.pet_ids = pet_ids;
	}
	public String getPet_levels() {
		return pet_levels;
	}
	public void setPet_levels(String pet_levels) {
		this.pet_levels = pet_levels;
	}
	public int getStrength() {
		return strength;
	}
	public void setStrength(int strength) {
		this.strength = strength;
	}
	public int getIntegral() {
		return integral;
	}
	public void setIntegral(int integral) {
		this.integral = integral;
	}
	public Timestamp getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}
}
