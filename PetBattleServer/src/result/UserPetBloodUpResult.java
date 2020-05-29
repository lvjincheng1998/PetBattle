package result;

import bean.UserPet;
import bean.UserProp;

public class UserPetBloodUpResult {
	private UserPet userPet;
	private UserProp userProp;
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
