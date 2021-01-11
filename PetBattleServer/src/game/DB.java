package game;

import java.util.HashMap;

import pers.jc.sql.CURD;

public class DB {
	public static CURD curd;
	
	public static void init() {
		HashMap<String, Object> config = new HashMap<>();
		config.put("driver", "com.mysql.cj.jdbc.Driver");
		config.put("host", "127.0.0.1");
		config.put("port", 3306);
		config.put("username", "root");
		config.put("password", "123456");
		config.put("database", "pet_battle");
		config.put("minIdle", 5);
		config.put("maxActive", 20);
		config.put("clearInterval", 3000L);
		curd = new CURD(config);
	}
}
