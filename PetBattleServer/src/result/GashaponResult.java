package result;

import bean.UserInfo;
import bean.UserPet;

public class GashaponResult {
	UserInfo userInfo;
	UserPet userPet;
	public GashaponResult(UserInfo userInfo, UserPet userPet) {
		this.userInfo = userInfo;
		this.userPet = userPet;
	}
	public UserInfo getUserInfo() {
		return userInfo;
	}
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	public UserPet getUserPet() {
		return userPet;
	}
	public void setUserPet(UserPet userPet) {
		this.userPet = userPet;
	}
}
