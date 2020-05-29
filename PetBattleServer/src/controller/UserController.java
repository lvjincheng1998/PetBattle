package controller;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import bean.UserInfo;
import bean.UserLogin;
import game.Player;
import pers.jc.mvc.Controller;
import pers.jc.sql.CURD;
import pers.jc.sql.SQL;
import pers.jc.sql.Transaction;
import pers.jc.util.JCLogger;
import result.RequestResult;

@Controller
public class UserController {
	public static ConcurrentHashMap<Integer, Player> userMapper = new ConcurrentHashMap<Integer, Player>();
	
	public static RequestResult login(Player player, String username, String password) {
		RequestResult requestResult = new RequestResult();
		UserLogin userLogin = CURD.selectOne(UserLogin.class, new SQL(){{
			WHERE("username=" + PARAM(username));
		}});
		if (userLogin == null) {
			requestResult.setMsg("该账号未注册");
			return requestResult; 
		}
		if (!userLogin.getPassword().equals(password)) {
			requestResult.setMsg("账号密码不匹配");
			return requestResult; 
		}
		UserInfo userInfo = CURD.selectOne(UserInfo.class, new SQL(){{
			WHERE("id=" + PARAM(userLogin.getId()));
		}});
		if (userInfo == null) {
			requestResult.setMsg("用户信息获取失败");
		} else {
			synchronized ("login") {
				Player user = userMapper.get(userInfo.getId());
				if (user == null) {
					player.id = userInfo.getId();
					player.userInfo = userInfo;
					userMapper.put(player.id, player);
					requestResult.setCode(200);
					requestResult.setData(userInfo);
					requestResult.setMsg("登录成功");
					JCLogger.info("(ID:" + userInfo.getId() + ")[" + userInfo.getNickname() + "]登录游戏");
				} else {
					requestResult.setMsg("该账号占用中");
				}
			}
		}
		return requestResult;
	}
	
	public RequestResult register(String username, String password) {
		RequestResult requestResult = new RequestResult();
		UserLogin userLogin = CURD.selectOne(UserLogin.class, new SQL(){{
			WHERE("username=" + PARAM(username));
		}});
		if (userLogin != null) {
			requestResult.setMsg("该账号已被注册");
			return requestResult;
		}
		String[] avatarUrls = new String[] {
			"http://118.89.184.186:888/avatar/cartoon/boy/1.jpg",
			"http://118.89.184.186:888/avatar/cartoon/boy/2.jpg",
			"http://118.89.184.186:888/avatar/cartoon/boy/3.jpg",
			"http://118.89.184.186:888/avatar/cartoon/girl/1.jpg",
			"http://118.89.184.186:888/avatar/cartoon/girl/2.jpg",
			"http://118.89.184.186:888/avatar/cartoon/girl/3.jpg",
		};
		UserInfo user_info = new UserInfo();
		new Transaction() {
			@Override
			public void run() throws Exception {
				UserLogin user_login = new UserLogin();
				user_login.setUsername(username);
				user_login.setPassword(password);
				insertAndGenerateKeys(user_login);
				user_info.setId(user_login.getId());
				user_info.setNickname("玩家" + user_login.getId());
				user_info.setAvatarUrl(avatarUrls[new Random().nextInt(avatarUrls.length)]);
				insert(user_info);
				commit();
			}
			@Override
			public void success() {
				JCLogger.info("(ID:" + user_info.getId() + ")[" + user_info.getNickname() + "]注册成功");
				requestResult.setCode(200);
				requestResult.setMsg("注册成功");
			}
			@Override
			public void fail() {
				requestResult.setMsg("注册失败");
			}
		};
		return requestResult;
	}
}
