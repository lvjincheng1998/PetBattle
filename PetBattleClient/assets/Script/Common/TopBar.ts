import GlobalData from "./GlobalData";
import GameMgr from "../Manager/GameMgr";
import Camper from "./Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopBar extends cc.Component {
    @property({type: cc.Node})
    area_bg: cc.Node = null;
    @property({type: cc.Node})
    area_label: cc.Node = null;
    @property({type: cc.Node})
    layout: cc.Node = null;
    @property({type: cc.Node})
    btn_back: cc.Node = null;

    label_theme: cc.Label = null;
    item_text_list: cc.Label[] = [];

    public static instance: TopBar;

    onLoad() {
        TopBar.instance = this;

        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        this.adapt();

        this.label_theme = this.area_label.getChildByName("Label").getComponent(cc.Label);
        this.layout.children.forEach((item: cc.Node) => {
            this.item_text_list.push(item.getChildByName("Text").getComponent(cc.Label));
            item.getChildByName("BtnPlus").on(cc.Node.EventType.TOUCH_END, () => {
                Camper.getInstance().showToast("尚未开放");
            });
        });
        this.btn_back.on(cc.Node.EventType.TOUCH_END, () => {
            this.back();
        });
    }

    back() {
        let pageInfo = GameMgr.pageStack.pop();
        if (pageInfo.name == "EquipmentSelect") {
            pageInfo.name = "PetDetailPage";
            GameMgr.pageStack.push(pageInfo);
            (pageInfo as any).tempNode.destroy();
        } else if (pageInfo.name == "PetDetailPage") {
            pageInfo.name = "PetPage";
            GameMgr.pageStack.push(pageInfo);
            let pi: any = pageInfo;
            cc.tween(pi.bag).to((pi.bagTargetX - pi.bag.x) / pi.speed, {x: pi.bagTargetX}).start();
            cc.tween(pi.display).to((pi.displayTargetX - pi.display.x) / pi.speed, {x: pi.displayTargetX}).start();
            cc.tween(pi.detail).to((pi.detailTargetX - pi.detail.x) / pi.speed, {x: pi.detailTargetX}).start();
            cc.tween(pi.detailBar).to((pi.detailBar.x - pi.detailBarTargetX) / pi.speed, {x: pi.detailBarTargetX}).then(cc.callFunc(() => {
                pi.target.detailLock = false;               
            })).start();
        } else {
            pageInfo.node.destroy();
            pageInfo.eventBlock.destroy();
        }
    }

    adapt() {
        this.node.zIndex = 10;
        this.area_bg.width = cc.winSize.width;
        this.area_label.x = -cc.winSize.width / 2;
        this.layout.x = - cc.winSize.width / 2 + 340;
        this.btn_back.x = cc.winSize.width / 2 - 10;
    }

    update() {
        if (GameMgr.pageStack.length == 1) {
            this.area_bg.active = false;
            this.area_label.active = false;
            this.btn_back.active = false;
            this.layout.x = -this.layout.width / 2 + 100;
        } else {
            this.area_bg.active = true;
            this.area_label.active = true;
            this.btn_back.active = true;
            this.layout.x = - cc.winSize.width / 2 + 340;
        }
        this.label_theme.string = GameMgr.pageStack[GameMgr.pageStack.length - 1].theme;
        this.item_text_list[0].string = this.convertCoin(GlobalData.userInfo.coin);
        this.item_text_list[1].string = GlobalData.userInfo.diamond.toString();
        this.item_text_list[2].string = GlobalData.userInfo.strength + "/100";
    }

    convertCoin(value: number): string {
        if (value < 10000) {
            return value.toString();
        } else {
            let str = (value / 10000).toString();
            let index = str.indexOf('.');
            if (index > -1) {
                str = str.substring(0, index + 2);
            }
            return str + '万';
        }
    }
}

