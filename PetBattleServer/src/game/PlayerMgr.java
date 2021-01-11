package game;

import java.util.concurrent.ConcurrentHashMap;

public class PlayerMgr {
	private static ConcurrentHashMap<Integer, Player> players = new ConcurrentHashMap<>();
	
	public static void add(Player player) {
		players.put(player.id, player);
	}
	
	public static void remove(Player player) {
		players.remove(player.id);
	}
	
	public static Player get(int id) {
		return players.get(id);
	}
	
	public static void callAll(String func, Object... args) {
		for (Player player : players.values()) {
			player.call(func, args);
		}
	}
}
