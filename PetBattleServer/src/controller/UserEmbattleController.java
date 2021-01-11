package controller;

import java.util.List;

import bean.UserEmbattle;
import game.DB;
import game.Player;
import pers.jc.network.SocketComponent;
import pers.jc.network.SocketMethod;
import pers.jc.sql.SQL;

@SocketComponent("UserEmbattleController")
public class UserEmbattleController {
	
	@SocketMethod
	public List<UserEmbattle> getEmbattle(Player player) {
		return DB.curd.select(UserEmbattle.class, new SQL(){{
			WHERE("user_id=" + player.userInfo.getId());
		}});
	}
	
	@SocketMethod
	public List<UserEmbattle> addPet(Player player, int sequence_id, int user_pet_id) {
		UserEmbattle userEmbattle = new UserEmbattle();
		userEmbattle.setUser_id(player.userInfo.getId());
		userEmbattle.setSequence_id(sequence_id);
		userEmbattle.setUser_pet_id(user_pet_id);
		DB.curd.insert(userEmbattle);
		return getEmbattle(player);
	}
	
	@SocketMethod
	public List<UserEmbattle> removePet(Player player, int user_embattle_id) {
		UserEmbattle userEmbattle = new UserEmbattle();
		userEmbattle.setId(user_embattle_id);
		DB.curd.delete(userEmbattle);
		return getEmbattle(player);
	}
}
