package result;

import bean.UserEquipment;
import bean.UserInfo;
import bean.UserProp;

public class UserEquipmentStarUpResult {
	private UserInfo userInfo;
	private UserProp userProp;
	private UserEquipment userEquipment;
	public UserInfo getUserInfo() {
		return userInfo;
	}
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	public UserProp getUserProp() {
		return userProp;
	}
	public void setUserProp(UserProp userProp) {
		this.userProp = userProp;
	}
	public UserEquipment getUserEquipment() {
		return userEquipment;
	}
	public void setUserEquipment(UserEquipment userEquipment) {
		this.userEquipment = userEquipment;
	}
}
