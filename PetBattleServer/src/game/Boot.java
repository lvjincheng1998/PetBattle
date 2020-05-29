package game;

import controller.ShopController;
import controller.UserEquipmentController;
import pers.jc.engine.JCEngine;
import pers.jc.sql.CURD;

public class Boot {
	
	public static void main(String[] args) throws Exception {
		CURD.init();
		BattleMgr.init();
		ShopController.init();
		UserEquipmentController.init();
		JCEngine.scanPackage("controller");
		JCEngine.scanPackage("game");
		JCEngine.boot(9999, "/petBattleServer", Player.class);
	}
}
