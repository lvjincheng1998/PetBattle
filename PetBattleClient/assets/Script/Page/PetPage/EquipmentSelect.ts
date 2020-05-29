import GlobalData from "../../Common/GlobalData";
import ResourceMgr from "../../Manager/ResourceMgr";
import DragonBone from "../../Component/DragonBone";
import Camper from "../../Common/Camper";
import JCTool from "../../SDK/JCTool";
import TopBar from "../../Common/TopBar";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentSelect extends cc.Component {
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

    onLoad() {
        //adapt
        let bag = this.node.getChildByName("Bag");
        let detail = this.node.getChildByName("Detail");
        let interval = (cc.winSize.width - (bag.width + detail.width)) / 3;
        bag.x = -cc.winSize.width / 2 + interval;
        detail.x = -cc.winSize.width / 2 + interval * 2 + bag.width + detail.width / 2;

        //clickevent
        this.node.getChildByName("BackGround").on(cc.Node.EventType.TOUCH_END, TopBar.instance.back.bind(TopBar.instance));

        this.clearBag();
        this.clearPanel();
    }

    clearBag() {
        let item = this.bagContent.children[0];
        let equipment = item.getChildByName("Equipment");
        item.active = false;
        equipment.active = false;
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

    activeEquip(userPetInfo: UserPetInfo, equipment_location_index: number, requester: any) {
        this.clickTopBarBtn(equipment_location_index);
        this.detail_btns.children[1].active = false;
        this.detail_btns.children[0].on(cc.Node.EventType.TOUCH_END, () => {
            GlobalData.player.call("UserEquipmentController.equipEquipment", [userPetInfo.userPet.id, this.currentUserEquipmentInfo.userEquipment.id], (res) => {
                if (res.code == 200) {
                    JCTool.updateObject(this.currentUserEquipmentInfo, GlobalData.createUserEquipmentInfo(res.data));
                    JCTool.updateObject(userPetInfo, GlobalData.createUserPetInfo(userPetInfo.userPet));
                    requester.updatePanle();
                } 
                Camper.getInstance().showToast(res.msg);
                TopBar.instance.back();
            });
        });
        
    }

    activeRemove(userPetInfo: UserPetInfo, equipment_location_index: number, requester: any) {
        this.currentUserEquipmentInfo = userPetInfo.userEquipmentInfos[equipment_location_index];
        this.clickBagItem();
        this.node.getChildByName("Bag").active = false;
        this.node.getChildByName("Detail").x = 0;
        this.detail_btns.children[0].active = false;
        this.detail_btns.children[1].on(cc.Node.EventType.TOUCH_END, () => {
            GlobalData.player.call("UserEquipmentController.removeEquipment", [this.currentUserEquipmentInfo.userEquipment.id], (res) => {
                if (res.code == 200) {
                    JCTool.updateObject(this.currentUserEquipmentInfo, GlobalData.createUserEquipmentInfo(res.data));
                    JCTool.updateObject(userPetInfo, GlobalData.createUserPetInfo(userPetInfo.userPet));
                    requester.updatePanle();
                } 
                Camper.getInstance().showToast(res.msg);
                TopBar.instance.back();
            });
        });
    }

    @property({type: cc.Node})
    topBarBtns: cc.Node = null;

    clickTopBarBtn(index: number) {
        this.topBarBtns.children.forEach((c, i) => {
            if (i != index) {
                c.active = false;
            }
        });

        let btnName = this.topBarBtns.children[index].getChildByName("Label").getComponent(cc.Label).string;
        let userEquipmentInfos = [];
        for (let userEquipmentInfo of GlobalData.userEquipmentInfos) {
            if (userEquipmentInfo.equipmentInfo.name.endsWith(btnName) && userEquipmentInfo.userEquipment.user_pet_id == 0) {
                userEquipmentInfos.push(userEquipmentInfo);
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
            item.getChildByName("Equipment").getChildByName("Row").getChildByName("Label").getComponent(cc.Label).string = 
                "+" +  this.currentUserEquipmentInfo.userEquipment.strength_level;
        } else {
            item.getChildByName("Equipment").getChildByName("Row").active = false;
        }
    }
}
