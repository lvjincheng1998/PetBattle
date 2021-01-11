package game;

import controller.ShopController;
import controller.UserEquipmentController;
import pers.jc.engine.JCEngine;

public class Boot {
	
	public static void main(String[] args) throws Exception {
		DB.init();
		BattleMgr.init();
		ShopController.init();
		UserEquipmentController.init();
		JCEngine.scanPackage("controller");
		JCEngine.scanPackage("game");
		JCEngine.boot(9999, "/petBattleServer", Player.class);
	}
}
