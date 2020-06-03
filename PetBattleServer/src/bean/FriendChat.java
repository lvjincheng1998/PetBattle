package bean;

import java.sql.Timestamp;
import pers.jc.sql.Column;
import pers.jc.sql.Id;
import pers.jc.sql.Table;

@Table("friend_chat")
public class FriendChat {
	@Id
	private String id;
	@Column
	private int sender_id;
	@Column
	private int receiver_id;
	@Column
	private String message;
	@Column
	private Timestamp send_time = new Timestamp(System.currentTimeMillis());
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getSender_id() {
		return sender_id;
	}
	public void setSender_id(int sender_id) {
		this.sender_id = sender_id;
	}
	public int getReceiver_id() {
		return receiver_id;
	}
	public void setReceiver_id(int receiver_id) {
		this.receiver_id = receiver_id;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Timestamp getSend_time() {
		return send_time;
	}
	public void setSend_time(Timestamp send_time) {
		this.send_time = send_time;
	}
}
