import { JCEngine } from "../SDK/JCEngine";
import Player from "../Player/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {
    @property({type: cc.Prefab})
    topBar: cc.Prefab = null;
    @property({type: cc.Prefab})
    mainPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    gashaponPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    embattlePage: cc.Prefab = null;
    @property({type: cc.Prefab})
    petPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    shopPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    bagPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    equipmentPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    vsPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    gameCopyPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    rankPage: cc.Prefab = null;
    @property({type: cc.Prefab})
    friendPage: cc.Prefab = null;
    
    static pageStack: PageInfo[] = [];

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        this.addPage("MainPage");
        this.addTopBar();
    }

    static getInstance(): GameMgr {
        return cc.find("Canvas").getComponent(GameMgr);
    }

    addTopBar() {
        this.node.addChild(cc.instantiate(this.topBar));
    }

    addPage(pageName: string) {
        if (pageName == "VSPage") {
            this.addVSPage();
            return;
        }
        let themes = {
            "MainPage": "", 
            "BagPage": "背包", 
            "EmbattlePage": "阵型", 
            "PetPage": "精灵", 
            "ShopPage": "商城", 
            "EquipmentPage": "装备", 
            "GashaponPage": "扭蛋机",
            "GameCopyPage": "副本",
            "RankPage": "排行榜",
            "FriendPage": "好友"
        }
        let quoteName = pageName.substring(0, 1).toLowerCase() + pageName.substring(1);
        let node = cc.instantiate(this[quoteName]);
        let eventBlock = this.addEventBlock();
        this.node.addChild(node);
        GameMgr.pageStack.push({
            name: pageName,
            theme: themes[pageName],
            node: node,
            eventBlock: eventBlock,
        });
    }

    addVSPage() {
        let node = cc.instantiate(this.vsPage);
        node.zIndex = 10;
        this.node.addChild(node);
        this.addEventBlock();
    }

    addEventBlock(): cc.Node {
        let node = new cc.Node();
        node.setContentSize(cc.winSize);
        node.addComponent(cc.BlockInputEvents);
        this.node.addChild(node);
        return node;
    }

    static enterGame() {
        GameMgr.pageStack = [];
        cc.director.loadScene("Game");
    }
}
interface PageInfo {
    name: string;
    theme: string;
    node: cc.Node;
    eventBlock: cc.Node;
}
