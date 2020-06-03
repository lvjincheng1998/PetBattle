package bean;

import pers.jc.sql.Column;
import pers.jc.sql.GeneratedValue;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("friend_mapper")
public class FriendMapper {
	@Id
	@GeneratedValue
	public int id;
	@Column
	public int inviter_id;
	@Column
	public int invitee_id;
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
}
