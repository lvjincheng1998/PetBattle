import ResourceMgr from "../Manager/ResourceMgr";
import GlobalData from "../Common/GlobalData";
import DragonBone from "../Component/DragonBone";
import Camper from "../Common/Camper";
import JCTool from "../SDK/JCTool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentPage extends cc.Component {
    @property({type: cc.Node})
    bagContent: cc.Node = null;
    @property({type: cc.Label})
    bagContentItemCount: cc.Label = null;

    @property({type: cc.Sprite})
    detail_base: cc.Sprite = null;
    @property({type: cc.Sprite})
    detail_frame: cc.Sprite = null;
    @property({type: cc.Sprite})
    detail_avatar: cc.Sprite = null;
    @property({type: cc.Node})
    detail_stars: cc.Node = null;
    @property({type: cc.Label})
    detail_name: cc.Label = null;
    @property({type: cc.Label})
    detail_starLevel: cc.Label = null;
    @property({type: cc.Label})
    detail_strengthLevel: cc.Label = null;
    @property({type: cc.Label})
    detail_introduce: cc.Label = null;
    @property({type: cc.Label})
    detail_mainStatus: cc.Label = null;
    @property({type: cc.Node})
    detail_viceStatusList: cc.Node = null;
    @property({type: cc.Node})
    detail_btns: cc.Node = null;

    @property({type: cc.Prefab})
    consumeModal: cc.Prefab = null;

    onLoad() {
        this.clearBag();
        this.clearPanel();
        this.detail_btns.children[0].on(cc.Node.EventType.TOUCH_END, () => {
            this.strengthUp();
        });
        this.detail_btns.children[1].on(cc.Node.EventType.TOUCH_END, () => {
            this.starUp();
        });
        this.detail_btns.children[2].on(cc.Node.EventType.TOUCH_END, () => {
            this.wash();
        });
        this.detail_btns.children[3].on(cc.Node.EventType.TOUCH_END, () => {
            this.sell();
        });
        this.updateBag(GlobalData.userEquipmentInfos);
    }

    clearBag() {
        let item = this.bagContent.children[0];
        item.active = false;
        item.getChildByName("Equipment").active = false;
        item.getChildByName("Tag").active = false;
        for (let i = 1; i < this.bagContent.childrenCount; i++) {
            this.bagContent.children[i].destroy();
        }
        this.bagContentItemCount.string = "装备数量:";
    }

    clearPanel() {
        let frameAndBase = ResourceMgr.getFrameAndBase("N");
        this.detail_base.spriteFrame = frameAndBase[1];
        this.detail_frame.spriteFrame = frameAndBase[0];
        this.detail_avatar.spriteFrame = null;
        this.detail_stars.children.forEach(c => {
            c.active = false;
        });
        this.detail_name.string = "";
        this.detail_starLevel.string = "星痕等级:";
        this.detail_strengthLevel.string = "强化等级:";
        this.detail_introduce.string = "";
        this.detail_mainStatus.string = "";
        this.detail_viceStatusList.children.forEach((c, index) => {
            c.active = false;
            if (index > 0) {
                c.destroy();
            }
        });
        this.detail_btns.active = false;
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

    @property({type: cc.Node})
    topBarBtns: cc.Node = null;

    clickTopBarBtn(e: cc.Event.EventTouch) {
        this.topBarBtns.children.forEach(c => {
            c.getChildByName("Base").opacity = 155;
            c.getChildByName("Base").color = cc.color(195, 235, 255);
            c.getChildByName("Label").color = cc.color(255, 255, 255);
        });
        e.getCurrentTarget().getChildByName("Base").opacity = 155;
        e.getCurrentTarget().getChildByName("Base").color = cc.color(0, 155, 255);
        e.getCurrentTarget().getChildByName("Label").color = cc.color(0, 55, 125);

        let btnName = e.getCurrentTarget().getChildByName("Label").getComponent(cc.Label).string;
        let userEquipmentInfos = [];
        if (btnName == "全部") {
            userEquipmentInfos = GlobalData.userEquipmentInfos;
        } else {
            for (let userEquipmentInfo of GlobalData.userEquipmentInfos) {
                if (userEquipmentInfo.equipmentInfo.name.endsWith(btnName)) {
                    userEquipmentInfos.push(userEquipmentInfo);
                }
            }
        }
        this.clearBag();
        this.clearPanel();
        this.updateBag(userEquipmentInfos);
    }

    updateBag(userEquipmentInfos: UserEquipmentInfo[]) {
        userEquipmentInfos.sort((a, b) => {
            return b.equipmentInfo.rarity.length - a.equipmentInfo.rarity.length;
        });
        userEquipmentInfos.sort((a, b) => {
            if (a.equipmentInfo.rarity == b.equipmentInfo.rarity) {
                return a.equipmentInfo.id - b.equipmentInfo.id;
            } else {
                return 0;
            }
        });
        let item = this.bagContent.children[0];
        let rectCount = 16;
        if (userEquipmentInfos.length > 16) {
            rectCount = Math.ceil(userEquipmentInfos.length / 4) * 4;
        }
        for (let i = 0; i < rectCount; i++) {
            let itemCopy = cc.instantiate(item);
            let equipment = itemCopy.getChildByName("Equipment");
            itemCopy.active = true;
            this.bagContent.addChild(itemCopy);

            if (userEquipmentInfos[i]) {
                equipment.active = true;
                let userEquipmentInfo = userEquipmentInfos[i];
                let userEquipment = userEquipmentInfo.userEquipment;
                let equipmentInfo = userEquipmentInfo.equipmentInfo;
                let frameAndBase = ResourceMgr.getFrameAndBase(equipmentInfo.rarity);
                equipment.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                equipment.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                equipment.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getEquipmentAvatar(equipmentInfo.id);
                equipment.getChildByName("Stars").children.forEach((c, index) => {
                    if (index < userEquipment.star_level) {
                        c.active = true;
                    } else {
                        c.active = false;
                    }
                });
                itemCopy.getChildByName("Tag").active = userEquipment.user_pet_id > 0 ? true : false;
                if (userEquipment.strength_level > 0) {
                    equipment.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = "+" + userEquipment.strength_level;
                } else {
                    equipment.getChildByName("Row").active = false;
                }

                itemCopy.on(cc.Node.EventType.TOUCH_END, () => {
                    this.addClickEffect(itemCopy);
                    this.clearPanel();
                    this.currentBagItem = itemCopy;
                    this.currentUserEquipmentInfo = userEquipmentInfo;
                    this.clickBagItem();
                });
            }
        }
        this.bagContentItemCount.string = "装备数量:" + userEquipmentInfos.length + "/200";
    }

    currentBagItem: cc.Node;
    currentUserEquipmentInfo: UserEquipmentInfo;

    clickBagItem() {
        this.detail_btns.active = true;
        let userEquipment = this.currentUserEquipmentInfo.userEquipment;
        let equipmentInfo = this.currentUserEquipmentInfo.equipmentInfo;
        let frameAndBase = ResourceMgr.getFrameAndBase(equipmentInfo.rarity);
        this.detail_base.spriteFrame = frameAndBase[1];
        this.detail_frame.spriteFrame = frameAndBase[0];
        this.detail_avatar.spriteFrame = ResourceMgr.getEquipmentAvatar(equipmentInfo.id);
        this.detail_stars.children.forEach((c, index) => {
            if (index < userEquipment.star_level) {
                c.active = true;
            } else {
                c.active = false;
            }
        });
        this.detail_name.node.color = ResourceMgr.getColorByRarity(equipmentInfo.rarity);
        this.detail_name.string = equipmentInfo.name;
        this.detail_starLevel.string = "星痕等级:+" + userEquipment.star_level;
        this.detail_strengthLevel.string = "强化等级:+" + userEquipment.strength_level;
        this.detail_introduce.string = equipmentInfo.introduce;
        let statusNameMap: any = {
            "hp": "生命",
            "attack": "攻击",
            "defend": "防御",
            "speed": "速度",
            "critRate": "暴击率",
            "critHurt": "暴击伤害",
            "hit": "命中效果",
            "resist": "效果抵抗"
        };
        let statusSuffixMap: any = {
            "hp": "",
            "attack": "",
            "defend": "",
            "speed": "",
            "critRate": "%",
            "critHurt": "%",
            "hit": "%",
            "resist": "%"
        };
        for (let statusName in userEquipment.main_status) {
            this.detail_mainStatus.node.color = ResourceMgr.getColorByRarity(equipmentInfo.rarity);
            this.detail_mainStatus.string = statusNameMap[statusName] + 
                "+" + userEquipment.main_status[statusName] +
                statusSuffixMap[statusName];
        }
        let viceStatusItem = this.detail_viceStatusList.children[0];
        for (let statusName in userEquipment.vice_status) {
            let viceStatusItemCopy = cc.instantiate(viceStatusItem);
            viceStatusItemCopy.active = true;
            viceStatusItemCopy.color = ResourceMgr.getColorByRarity(equipmentInfo.rarity);
            viceStatusItemCopy.getComponent(cc.Label).string = statusNameMap[statusName] + 
                "+" + userEquipment.vice_status[statusName] +
                statusSuffixMap[statusName];
            this.detail_viceStatusList.addChild(viceStatusItemCopy);
        }
    }

    updateBagItem(item: cc.Node) {
        item.getChildByName("Equipment").getChildByName("Stars").children.forEach((c, index) => {
            if (index < this.currentUserEquipmentInfo.userEquipment.star_level) {
                c.active = true;
            } else {
                c.active = false;
            }
        });
        if ( this.currentUserEquipmentInfo.userEquipment.strength_level > 0) {
            item.getChildByName("Equipment").getChildByName("Row").active = true;
            item.getChildByName("Equipment").getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                "+" +  this.currentUserEquipmentInfo.userEquipment.strength_level;
        } else {
            item.getChildByName("Equipment").getChildByName("Row").active = false;
        }
    }

    strengthUp() {
        let userEquipment = this.currentUserEquipmentInfo.userEquipment;
        let equipmentInfo = this.currentUserEquipmentInfo.equipmentInfo;

        if (userEquipment.strength_level >= 15) {
            Camper.getInstance().showToast("强化等级已满");
            return;
        }

        let modal = cc.instantiate(this.consumeModal);
        this.node.addChild(modal);
        modal.getChildByName("Base").on(cc.Node.EventType.TOUCH_END, () => {
            modal.destroy();
        });
        let coin_consume = (userEquipment.strength_level + 1) * 1000;
        modal.getChildByName("ConsumeCoin").getChildByName("Layout").getChildByName("Label").getComponent(cc.Label).string = 
            coin_consume.toString();

        let propIdMap1 = {
            "R": 2000,
            "SR": 2010,
            "SSR": 2020
        };
        let propIdMap2 = {
            "hp": 3,
            "attack": 1,
            "defend": 2,
            "speed": 1,
            "critRate": 1,
            "critHurt": 1,
            "hit": 1,
            "resist": 2,
        };
        let statusName = null;
        for (let sn in userEquipment.main_status) {
            statusName = sn;
        }
        let propId = propIdMap1[equipmentInfo.rarity] + propIdMap2[statusName];

        let propInfo = ResourceMgr.getPropInfo(propId);
        let prop = modal.getChildByName("ConsumePropList").getChildByName("Prop");
        let frameAndBase = ResourceMgr.getFrameAndBase(propInfo.rarity);
        prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
        prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
        prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPropAvatar(propInfo.id);

        let prop_consume = userEquipment.strength_level + 1;
        let userPropInfo = GlobalData.getUserPropInfo(propId);
        if (userPropInfo && userPropInfo.userProp.amount >= prop_consume) {
            prop.getChildByName("Row").getChildByName("Label").color = cc.Color.GREEN;
            prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                userPropInfo.userProp.amount + "/" + prop_consume;
        } else {
            prop.getChildByName("Row").getChildByName("Label").color = cc.Color.RED;
            if (userPropInfo) {
                prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                    userPropInfo.userProp.amount + "/" + prop_consume;
            } else {
                prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                    "0/" + prop_consume;
            }
        }

        modal.getChildByName("Btn").getChildByName("Value").getComponent(cc.Label).string = "强化";
        modal.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            GlobalData.player.call("UserEquipmentController.strengthUp", [userEquipment.id, propId, prop_consume, coin_consume], (res) => {
                if (res.code == 200) {
                    GlobalData.userInfo = res.data.userInfo;
                    GlobalData.updateUserPropInfos([res.data.userProp]);
                    JCTool.updateObject(this.currentUserEquipmentInfo, GlobalData.createUserEquipmentInfo(res.data.userEquipment));
                    this.clearPanel();
                    this.updateBagItem(this.currentBagItem);
                    this.clickBagItem();
                } else {
                    Camper.getInstance().showToast(res.msg)
                }
                modal.destroy();
            });
        });
    }

    starUp() {
        let userEquipment = this.currentUserEquipmentInfo.userEquipment;
        let equipmentInfo = this.currentUserEquipmentInfo.equipmentInfo;

        if (userEquipment.star_level >= 5) {
            Camper.getInstance().showToast("星痕等级已满");
            return;
        }

        let modal = cc.instantiate(this.consumeModal);
        this.node.addChild(modal);
        modal.getChildByName("Base").on(cc.Node.EventType.TOUCH_END, () => {
            modal.destroy();
        });
        let coin_consume = (userEquipment.star_level + 1) * 10000;
        modal.getChildByName("ConsumeCoin").getChildByName("Layout").getChildByName("Label").getComponent(cc.Label).string = 
            coin_consume.toString();

        let propIdMap = {
            "R": 2031,
            "SR": 2032,
            "SSR": 2033
        };
        let propId = propIdMap[equipmentInfo.rarity];

        let propInfo = ResourceMgr.getPropInfo(propId);
        let prop = modal.getChildByName("ConsumePropList").getChildByName("Prop");
        let frameAndBase = ResourceMgr.getFrameAndBase(propInfo.rarity);
        prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
        prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
        prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPropAvatar(propInfo.id);

        let prop_consume = userEquipment.star_level + 1;
        let userPropInfo = GlobalData.getUserPropInfo(propId);
        if (userPropInfo && userPropInfo.userProp.amount >= prop_consume) {
            prop.getChildByName("Row").getChildByName("Label").color = cc.Color.GREEN;
            prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                userPropInfo.userProp.amount + "/" + prop_consume;
        } else {
            prop.getChildByName("Row").getChildByName("Label").color = cc.Color.RED;
            if (userPropInfo) {
                prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                    userPropInfo.userProp.amount + "/" + prop_consume;
            } else {
                prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                    "0/" + prop_consume;
            }
        }

        modal.getChildByName("Btn").getChildByName("Value").getComponent(cc.Label).string = "升星";
        modal.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            GlobalData.player.call("UserEquipmentController.starUp", [userEquipment.id, propId, prop_consume, coin_consume], (res) => {
                if (res.code == 200) {
                    GlobalData.userInfo = res.data.userInfo;
                    GlobalData.updateUserPropInfos([res.data.userProp]);
                    JCTool.updateObject(this.currentUserEquipmentInfo, GlobalData.createUserEquipmentInfo(res.data.userEquipment));
                    this.clearPanel();
                    this.updateBagItem(this.currentBagItem);
                    this.clickBagItem();
                } else {
                    Camper.getInstance().showToast(res.msg)
                }
                modal.destroy();
            });
        });
    }

    wash() {
        let userEquipment = this.currentUserEquipmentInfo.userEquipment;

        let modal = cc.instantiate(this.consumeModal);
        this.node.addChild(modal);
        modal.getChildByName("Base").on(cc.Node.EventType.TOUCH_END, () => {
            modal.destroy();
        });
        let coin_consume = 10000;
        modal.getChildByName("ConsumeCoin").getChildByName("Layout").getChildByName("Label").getComponent(cc.Label).string = 
            coin_consume.toString();

        let consumePropList = modal.getChildByName("ConsumePropList");
        for (let i = 0; i < 2; i++) {
            if (i > 0) {
                consumePropList.addChild(cc.instantiate(consumePropList.children[0]));
            }
            let propId = 2041 + i;
            let propInfo = ResourceMgr.getPropInfo(propId);
            let prop = consumePropList.children[i];
            let frameAndBase = ResourceMgr.getFrameAndBase(propInfo.rarity);
            prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
            prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
            prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPropAvatar(propInfo.id);

            let prop_consume = 1;
            let userPropInfo = GlobalData.getUserPropInfo(propId);
            if (userPropInfo && userPropInfo.userProp.amount >= prop_consume) {
                prop.getChildByName("Row").getChildByName("Label").color = cc.Color.GREEN;
                prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                    userPropInfo.userProp.amount + "/" + prop_consume;
            } else {
                prop.getChildByName("Row").getChildByName("Label").color = cc.Color.RED;
                if (userPropInfo) {
                    prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                        userPropInfo.userProp.amount + "/" + prop_consume;
                } else {
                    prop.getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                        "0/" + prop_consume;
                }
            }
        }
        modal.getChildByName("Btn").getChildByName("Value").getComponent(cc.Label).string = "洗炼";
        modal.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            GlobalData.player.call("UserEquipmentController.wash", [userEquipment.id, [2041, 2042], [1, 1], coin_consume], (res) => {
                if (res.code == 200) {
                    GlobalData.userInfo = res.data.userInfo;
                    GlobalData.updateUserPropInfos(res.data.userProps);
                    JCTool.updateObject(this.currentUserEquipmentInfo, GlobalData.createUserEquipmentInfo(res.data.userEquipment));
                    this.clearPanel();
                    this.updateBagItem(this.currentBagItem);
                    this.clickBagItem();
                } else {
                    Camper.getInstance().showToast(res.msg)
                }
                modal.destroy();
            });
        });
    }

    sell() {
        let userEquipments = [this.currentUserEquipmentInfo.userEquipment];
        GlobalData.player.call("UserEquipmentController.sell", [userEquipments], (res) => {
            if (res.code == 200) {
                GlobalData.userInfo = res.data;
                GlobalData.removeUserEquipmentInfos(userEquipments);
                this.clearPanel();
                this.currentBagItem.destroy();
                let itemCopy = cc.instantiate(this.bagContent.children[0]);
                itemCopy.active = true;
                this.bagContent.addChild(itemCopy);
            }
            Camper.getInstance().showToast(res.msg);
        });
    }
}
