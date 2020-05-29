package controller;

import java.util.List;
import bean.UserEmbattle;
import game.Player;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.sql.SQL;

@Controller
public class UserEmbattleController {
	
	public List<UserEmbattle> getEmbattle(Player player) {
		return CURD.select(UserEmbattle.class, new SQL(){{
			WHERE("user_id=" + player.userInfo.getId());
		}});
	}
	
	public List<UserEmbattle> addPet(Player player, int sequence_id, int user_pet_id) {
		UserEmbattle userEmbattle = new UserEmbattle();
		userEmbattle.setUser_id(player.userInfo.getId());
		userEmbattle.setSequence_id(sequence_id);
		userEmbattle.setUser_pet_id(user_pet_id);
		CURD.insert(userEmbattle);
		return getEmbattle(player);
	}
	
	public List<UserEmbattle> removePet(Player player, int user_embattle_id) {
		UserEmbattle userEmbattle = new UserEmbattle();
		userEmbattle.setId(user_embattle_id);
		CURD.delete(userEmbattle);
		return getEmbattle(player);
	}
}
