import ResourceMgr from "../Manager/ResourceMgr";
import GlobalData from "../Common/GlobalData";
import DragonBone from "../Component/DragonBone";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BagPage extends cc.Component {
    @property({type: cc.Node})
    topBarBtns: cc.Node = null;
    @property({type: cc.Node})
    bagContent: cc.Node = null;
    @property({type: cc.Label})
    bagPropCount: cc.Label = null;

    @property({type: cc.Node})
    display_prop: cc.Node = null;
    @property({type: cc.Label})
    display_name: cc.Label = null;
    @property({type: cc.Label})
    display_ownCount: cc.Label = null;
    @property({type: cc.Label})
    display_introduce: cc.Label = null;

    @property({type: cc.Node})
    item_btns: cc.Node = null;

    currentItem: cc.Node;
    currentUserPropInfo: UserPropInfo;

    onLoad() {
        this.clearPanel();
        this.clearBag();
        this.updateBag(GlobalData.userPropInfos);
        this.item_btns.children[0].on(cc.Node.EventType.TOUCH_END, () => {
            let userProps = [this.currentUserPropInfo.userProp];
            GlobalData.player.call("UserPropController.sell", [userProps], (res) => {
                if (res.code == 200) {
                    GlobalData.userInfo = res.data;
                    GlobalData.removeUserPropInfos(userProps);
                    this.clearPanel();
                    this.currentItem.destroy();
                    let copy = cc.instantiate(this.bagContent.children[0]);
                    copy.active = true;
                    copy.getChildByName("Prop").active = false;
                    this.bagContent.addChild(copy);
                }
                Camper.getInstance().showToast(res.msg);
            });
        });
        this.item_btns.children[1].on(cc.Node.EventType.TOUCH_END, () => {
            Camper.getInstance().showToast("该道具不能直接使用");
        });
    }

    clearPanel() {
        let frameAndBase = ResourceMgr.getFrameAndBase("N");
        this.display_prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
        this.display_prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
        this.display_prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = null;
        this.display_name.string = "";
        this.display_ownCount.string = "0";
        this.display_introduce.string = "";
        this.item_btns.children.forEach(c => {
            c.active = false;
        });
    }

    clearBag() {
        let frame = this.bagContent.children[0];
        let prop = frame.getChildByName("Prop");
        frame.active = false;
        prop.active = false;
        for (let i = 1; i < this.bagContent.childrenCount; i++) {
            this.bagContent.children[i].destroy();
        }
        this.bagPropCount.string = "";
    }

    addClickEffect(node: cc.Node) {
        for (let child of this.bagContent.children) {
            let frameNode = child.getChildByName("frameNode-xxx")
            if (frameNode) {
                frameNode.destroy();
            }
        }
        let frameNode = new cc.Node("frameNode-xxx");
        frameNode.y = 4;
        frameNode.addComponent(DragonBone).init("DragonBone/Common/Frame").playAnimation("run", 0);
        node.addChild(frameNode);
    }

    updateBag(userPropInfos: UserPropInfo[]) {
        userPropInfos.sort((a, b) => {
            return a.propInfo.id - b.propInfo.id;
        });
        for (let i = 0; i < 40; i++) {
            let frameCopy = cc.instantiate(this.bagContent.children[0]);
            frameCopy.active = true;
            this.bagContent.addChild(frameCopy);
            if (userPropInfos[i]) {
                let userPropInfo = userPropInfos[i];
                let prop = frameCopy.getChildByName("Prop");
                let frameAndBase = ResourceMgr.getFrameAndBase(userPropInfo.propInfo.rarity);
                prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPropAvatar(userPropInfo.propInfo.id);
                prop.getChildByName("Count").getComponent(cc.Label).string = "x" + userPropInfo.userProp.amount;
                prop.active = true;
                prop.on(cc.Node.EventType.TOUCH_END, () => {
                    this.currentItem = frameCopy;
                    this.currentUserPropInfo = userPropInfo;
                    this.addClickEffect(frameCopy);
                    this.clearPanel();
                    let frameAndBase = ResourceMgr.getFrameAndBase(userPropInfo.propInfo.rarity);
                    this.display_prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                    this.display_prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                    this.display_prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPropAvatar(userPropInfo.propInfo.id);
                    this.display_name.node.color = ResourceMgr.getColorByRarity(userPropInfo.propInfo.rarity);
                    this.display_name.string = userPropInfo.propInfo.name;
                    this.display_ownCount.string = userPropInfo.userProp.amount.toString();
                    this.display_introduce.string = userPropInfo.propInfo.introduce;
                    this.item_btns.children.forEach(c => {
                        c.active = true;
                    });
                });
            }
        }
        this.bagPropCount.string = "道具数量:" + userPropInfos.length + "/40";
    }

    @property({type: cc.SpriteFrame})
    btnBlueYellow: cc.SpriteFrame[] = [];

    clickTopBarBtn(e: cc.Event.EventTouch) {
        this.topBarBtns.children.forEach(c => {
            c.getComponent(cc.Sprite).spriteFrame = this.btnBlueYellow[0];
            c.getChildByName("Label").color = cc.color(0, 55, 125);
        });
        e.getCurrentTarget().getComponent(cc.Sprite).spriteFrame = this.btnBlueYellow[1];
        e.getCurrentTarget().getChildByName("Label").color = cc.color(155, 75, 0);
        let btnName = e.getCurrentTarget().getChildByName("Label").getComponent(cc.Label).string;
        this.clearPanel();
        this.clearBag();
        if (btnName == "全部") {
            this.updateBag(GlobalData.userPropInfos);
        } else {
            let userPropInfos = [];
            for (let uesrPropInfo of GlobalData.userPropInfos) {
                if (uesrPropInfo.propInfo.classify == btnName) {
                    userPropInfos.push(uesrPropInfo);
                }
            }
            this.updateBag(userPropInfos);
        }
    }
}
