package result;

import bean.UserEquipment;
import bean.UserInfo;
import bean.UserProp;

public class UserEquipmentWashResult {
	private UserInfo userInfo;
	private UserProp[] userProps;
	private UserEquipment userEquipment;
	public UserInfo getUserInfo() {
		return userInfo;
	}
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	public UserProp[] getUserProps() {
		return userProps;
	}
	public void setUserProps(UserProp[] userProps) {
		this.userProps = userProps;
	}
	public UserEquipment getUserEquipment() {
		return userEquipment;
	}
	public void setUserEquipment(UserEquipment userEquipment) {
		this.userEquipment = userEquipment;
	}
}
