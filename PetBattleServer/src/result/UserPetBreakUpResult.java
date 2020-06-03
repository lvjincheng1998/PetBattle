package result;

import bean.UserInfo;
import bean.UserPet;
import bean.UserProp;

public class UserPetBreakUpResult {
	private UserInfo userInfo;
	private UserPet userPet;
	private UserProp userProp;
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
	public UserProp getUserProp() {
		return userProp;
	}
	public void setUserProp(UserProp userProp) {
		this.userProp = userProp;
	}
}
