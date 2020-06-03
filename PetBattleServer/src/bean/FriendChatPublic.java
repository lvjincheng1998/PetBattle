package bean;

public class FriendChatPublic {
	public int player_id;
	public String nickname;
	public String avatarUrl;
	public int integral;
	public String message;
	public long timestamp = System.currentTimeMillis();
	public FriendChatPublic(int player_id, String nickname, String avatarUrl, int integral, String message) {
		this.player_id = player_id;
		this.nickname = nickname;
		this.avatarUrl = avatarUrl;
		this.integral = integral;
		this.message = message;
	}
	public int getPlayer_id() {
		return player_id;
	}
	public void setPlayer_id(int player_id) {
		this.player_id = player_id;
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
	public int getIntegral() {
		return integral;
	}
	public void setIntegral(int integral) {
		this.integral = integral;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
}
