package bean;

import pers.jc.sql.Column;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("friend_mapper, user_info")
public class Friend {
	@Id("friend_mapper.id")
	private int id;
	@Column
	private int inviter_id;
	@Column
	private int invitee_id;
	@Column
	private String nickname;
	@Column
	private int gender;
	@Column
	private String avatarUrl;
	@Column
	private int integral;
	private int newMsgCount;
	private int friend_id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getInviter_id() {
		return inviter_id;
	}
	public void setInviter_id(int inviter_id) {
		this.inviter_id = inviter_id;
	}
	public int getInvitee_id() {
		return invitee_id;
	}
	public void setInvitee_id(int invitee_id) {
		this.invitee_id = invitee_id;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public int getGender() {
		return gender;
	}
	public void setGender(int gender) {
		this.gender = gender;
	}
	public String getAvatarUrl() {
		return avatarUrl;
	}
	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}
	public int getIntegral() {
		return integral;
	}
	public void setIntegral(int integral) {
		this.integral = integral;
	}
	public int getNewMsgCount() {
		return newMsgCount;
	}
	public void setNewMsgCount(int newMsgCount) {
		this.newMsgCount = newMsgCount;
	}
	public int getFriend_id() {
		return friend_id;
	}
	public void setFriend_id(int friend_id) {
		this.friend_id = friend_id;
	}
}
