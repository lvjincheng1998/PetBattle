import GlobalData from "../../Common/GlobalData";
import ResourceMgr from "../../Manager/ResourceMgr";
import DragonBone from "../../Component/DragonBone";
import GameMgr from "../../Manager/GameMgr";
import Camper from "../../Common/Camper";
import JCTool from "../../SDK/JCTool";
import EquipmentSelect from "./EquipmentSelect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PetPage extends cc.Component {
    @property({type: cc.Node})
    bag: cc.Node = null;
    @property({type: cc.Node})
    display: cc.Node = null;
    @property({type: cc.Node})
    detail: cc.Node = null;
    @property({type: cc.Node})
    detailBar: cc.Node = null;
    //bag
    @property({type: cc.Node})
    btnRank: cc.Node = null;
    @property({type: cc.Label})
    bagLabelValue: cc.Label = null;
    @property({type: cc.Node})
    bagContent: cc.Node = null;
    @property({type: cc.Node})
    bagContentItem: cc.Node = null;
    //display
    @property({type: cc.Sprite})
    rarity: cc.Sprite = null;
    @property({type: cc.Label})
    petName: cc.Label = null;
    @property({type: cc.Node})
    petDetailBtn: cc.Node = null;
    @property({type: cc.Node})
    petModel: cc.Node = null;
    @property({type: cc.Label})
    petStatusList: cc.Label[] = [];
    //detail
    @property({type: cc.Node})
    detailStatusList: cc.Node = null;
    @property({type: cc.Node})
    skillListContent: cc.Node = null;
    @property({type: cc.SpriteFrame})
    detailBtnFrame: cc.SpriteFrame[] = [];
    //detailChildren
    @property({type: cc.Prefab})
    detail_levelUp: cc.Prefab = null;
    @property({type: cc.Prefab})
    detail_blood: cc.Prefab = null;
    @property({type: cc.Prefab})
    detail_break: cc.Prefab = null;
    @property({type: cc.Prefab})
    detail_equipment: cc.Prefab = null;
    @property({type: cc.Prefab})
    detail_equipmentSelect: cc.Prefab = null;

    isShowingRank: boolean = false;
    detailLock: boolean = false;

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)

        //auto adapt
        if (cc.winSize.width <= cc.view.getDesignResolutionSize().width) {
            this.bag.x = -cc.winSize.width / 2 + 20;
            this.display.x = (cc.winSize.width / 2 + (this.bag.x + this.bag.width)) / 2;
        }

        this.btnRank.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.isShowingRank) {
                this.isShowingRank = false;
            } else {
                this.isShowingRank = true;
            }
        });
        this.petDetailBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.detailLock) {
                return;
            }
            this.detailLock = true;
            let pageInfo = GameMgr.pageStack[GameMgr.pageStack.length - 1];
            pageInfo.name = "PetDetailPage";
            let speed = 1000;
            (pageInfo as any).speed = speed;
            (pageInfo as any).target = this;
            (pageInfo as any).bag = this.bag;
            (pageInfo as any).detail = this.detail;
            (pageInfo as any).detailBar = this.detailBar;
            (pageInfo as any).display = this.display;
            (pageInfo as any).bagTargetX = this.bag.x;
            (pageInfo as any).detailTargetX = this.detail.x;
            (pageInfo as any).detailBarTargetX = this.detailBar.x;
            (pageInfo as any).displayTargetX = this.display.x;
            let bagTargetX = -cc.winSize.width / 2  - this.bag.width;
            let detailTargetX = cc.winSize.width / 2 - this.detail.width - 20;
            let detailBarTargetX = -cc.winSize.width / 2;
            let displayTargetX = (detailBarTargetX + this.detailBar.width + detailTargetX) / 2;
            cc.tween(this.bag).to((this.bag.x - bagTargetX) / speed, {x: bagTargetX}).start();
            cc.tween(this.display).to((this.display.x - displayTargetX) / speed, {x: displayTargetX}).start();
            cc.tween(this.detail).to((this.detail.x - detailTargetX) / speed, {x: detailTargetX}).start();
            cc.tween(this.detailBar).to((detailBarTargetX - this.detailBar.x) / speed, {x: detailBarTargetX}).start();
            this.detailBar.getChildByName("Btns").children.forEach(c => {
                c.getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[0];
                c.getChildByName("Label").color = cc.color(0, 55, 125);
            });
            this.detailBar.getChildByName("Btns").children[0].getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[1];
            this.detailBar.getChildByName("Btns").children[0].getChildByName("Label").color = cc.color(155, 75, 0);
            let childPanel = this.detail.getChildByName("ChildPanel");
                childPanel.children.forEach(c => {
                c.destroy();
            });
            this.updateDetailStatusList();
            this.updateSkillList();
        });
        this.clearDisplay();
        this.rankBag(null, "rarity");

        cc.tween(this.petDetailBtn.getChildByName("Switch")).repeatForever(cc.rotateBy(3, 360)).start();
    }

    currentBagItem: cc.Node;
    currentUserPetInfo: UserPetInfo;

    clickDetailBtn(e: cc.Event.EventTouch) {
        this.detailBar.getChildByName("Btns").children.forEach(c => {
            c.getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[0];
            c.getChildByName("Label").color = cc.color(0, 55, 125);
        });
        e.getCurrentTarget().getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[1];
        e.getCurrentTarget().getChildByName("Label").color = cc.color(155, 75, 0);
        let btnName = e.getCurrentTarget().getChildByName("Label").getComponent(cc.Label).string;
        let childPanel = this.detail.getChildByName("ChildPanel");
        childPanel.children.forEach(c => {
            c.destroy();
        });
        if (btnName == "详情") {
            this.updateDetailStatusList();
            this.updateSkillList();
        } else if (btnName == "升级") {
            new LevelUp(this);
        } else if (btnName == "血统") {
            new BloodUp(this);
        } else if (btnName == "突破") {
            new BreakUp(this);
        } else if (btnName == "装备") {
            new Equipment(this);
        }
    }

    updateDetailStatusList() {
        let status = this.currentUserPetInfo.userPetStatus;
        let statusList = ["hp", "attack", "defend", "speed", "critRate", "critHurt", "hit", "resist"];
        for (let s in status) {
            let index = statusList.indexOf(s);
            this.detailStatusList.children[index].getChildByName("Row").children[0].getComponent(cc.Label).string = 
                status[s][0].toString() + (index > 3 ? "%" : "");
            this.detailStatusList.children[index].getChildByName("Row").children[1].getComponent(cc.Label).string = 
                "+" + status[s][1] + (index > 3 ? "%" : "");
        }
    }

    updateSkillList() {
        let skills = this.currentUserPetInfo.petInfo.skills;
        for (let i = 0; i < skills.length; i++) {
            let skill = skills[i];
            this.skillListContent.children[i].getChildByName("Name").getComponent(cc.Label).string = (i + 1) + "、" + skill.name;
            this.skillListContent.children[i].getChildByName("Name").getChildByName("EnergyValue").getComponent(cc.Label).string = skill.energy.toString();
            this.skillListContent.children[i].getChildByName("Introduce").getComponent(cc.Label).string = skill.explain;
        }
    }

    clearDisplay() {
        this.rarity.spriteFrame = null;
        this.petName.string = "";
        this.petDetailBtn.active = false;
        this.petModel.removeComponent(DragonBone);
        this.petModel.removeComponent(dragonBones.ArmatureDisplay);
        this.petStatusList.forEach(c => {
            c.string = "";
        });
    }

    renderDisplay(userPet: UserPet, petInfo: PetInfo, strength: number) {
        this.rarity.spriteFrame = ResourceMgr.getRarity(petInfo.rarity);
        this.petName.string = petInfo.name;
        this.petName.node.color = ResourceMgr.getColorByRarity(petInfo.rarity);
        this.petModel.addComponent(DragonBone).init(ResourceMgr.getPetUrl(petInfo.id)).playAnimation("stand", 0);
        this.petDetailBtn.active = true;
        this.renderDisplayStatusList(userPet, strength);
    }

    renderDisplayStatusList(userPet: UserPet, strength: number) {
        this.petStatusList[0].string = strength.toString();
        this.petStatusList[1].string = userPet.pet_level.toString();
        this.petStatusList[2].string = userPet.blood_level.toString();
        this.petStatusList[3].string = userPet.break_level.toString();
    }

    updateBag() {
        this.bagLabelValue.string = GlobalData.userPetInfos.length + "/200";
        for (let child of this.bagContent.children) {
            if (child.active) {
                child.destroy();
            }
        }
        for (let userPetInfo of GlobalData.userPetInfos) {
            let userPet = userPetInfo.userPet;
            let petInfo = userPetInfo.petInfo;
            let item = cc.instantiate(this.bagContentItem);
            item.active = true;
            this.bagContent.addChild(item);
            let frameAndBase = ResourceMgr.getFrameAndBase(petInfo.rarity);
            item.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
            item.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
            item.getChildByName("Rarity").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getRarity(petInfo.rarity);
            item.getChildByName("Level").getComponent(cc.Label).string = userPet.pet_level.toString();
            item.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPetAvatar(userPet.pet_id);
            item.on(cc.Node.EventType.TOUCH_END, () => {
                if (item == this.currentBagItem) {
                    this.petDetailBtn.emit(cc.Node.EventType.TOUCH_END);
                    return;
                }
                this.currentBagItem = item;
                this.currentUserPetInfo = userPetInfo;
                for (let child of this.bagContent.children) {
                    let frameNode = child.getChildByName("frameNode-xxx")
                    if (frameNode) {
                        frameNode.destroy();
                    }
                }
                let frameNode = new cc.Node("frameNode-xxx");
                frameNode.y = 4;
                frameNode.addComponent(DragonBone).init("DragonBone/Common/Frame").playAnimation("run", 0);
                item.addChild(frameNode);
                this.renderDisplay(userPet, petInfo, userPetInfo.strength);
            });
        }
    }

    updateBagItem() {
        this.currentBagItem.getChildByName("Level").getComponent(cc.Label).string = this.currentUserPetInfo.userPet.pet_level.toString();
    }

    rank_level_down: boolean = false;
    rank_rarity_down: boolean = false;
    rank_strength_down: boolean = false;
    rankBag(e: cc.Event.EventTouch, tag: string) {
        if (tag == "level") {
            if (this.rank_level_down) {
                this.rank_level_down = false;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return a.userPet.pet_level - b.userPet.pet_level;
                });
            } else {
                this.rank_level_down = true;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return b.userPet.pet_level - a.userPet.pet_level;
                });
            }
        }
        if (tag == "rarity") {
            let rarityRank = ["R", "SR", "SSR", "SP"]
            if (this.rank_rarity_down) {
                this.rank_rarity_down = false;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return rarityRank.indexOf(a.petInfo.rarity) - rarityRank.indexOf(b.petInfo.rarity);
                });
            } else {
                this.rank_rarity_down = true;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return rarityRank.indexOf(b.petInfo.rarity) - rarityRank.indexOf(a.petInfo.rarity);
                });
            }
        }
        if (tag == "strength") {
            if (this.rank_strength_down) {
                this.rank_strength_down = false;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return a.strength - b.strength;
                });
            } else {
                this.rank_strength_down = true;
                GlobalData.userPetInfos.sort((a: UserPetInfo, b: UserPetInfo) => {
                    return b.strength - a.strength;
                });
            }
        }
        this.updateBag();
    }

    update() {
        let listBase = this.btnRank.getChildByName("ListBase");
        let listRank = this.btnRank.getChildByName("ListRank");
        if (this.isShowingRank) {
            if (listBase.scaleY < 1) {
                listBase.scaleY += 0.05;
                listRank.scaleY += 0.05;
            }
        } else {
            if (listBase.scaleY > 0) {
                listBase.scaleY -= 0.05;
                listRank.scaleY -= 0.05;
            }
        }
    }
}
class LevelUp {
    target: PetPage;
    node: cc.Node;
    userPetInfo: UserPetInfo;
    prop_id: number;

    constructor(target: PetPage) {
        this.target = target;
        this.init();
        this.updatePanel();
    }

    init() {
        let childPanel = this.target.detail.getChildByName("ChildPanel");
        this.node = cc.instantiate(this.target.detail_levelUp);
        childPanel.addChild(this.node);
        this.userPetInfo = this.target.currentUserPetInfo;

        this.node.getChildByName("ConsumeList").children.forEach((c: cc.Node, index: number) => {
            let prop_id = 1001 + index;
            c.on(cc.Node.EventType.TOUCH_END, () => {
                this.prop_id = prop_id;
                for (let child of this.node.getChildByName("ConsumeList").children) {
                    let frameNode = child.getChildByName("frameNode-xxx")
                    if (frameNode) {
                        frameNode.destroy();
                    }
                }
                let frameNode = new cc.Node("frameNode-xxx");
                frameNode.y = -50 + 4;
                frameNode.addComponent(DragonBone).init("DragonBone/Common/Frame").playAnimation("run", 0);
                c.addChild(frameNode);
            });
        });

        this.node.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            if (this.userPetInfo.userPet.pet_level >= 100) {
                Camper.getInstance().showToast("精灵等级已满");
                return;
            }
            if (this.prop_id) {
                if (GlobalData.getUserPropInfo(this.prop_id)) {
                    GlobalData.player.call("UserPetController.levelUp", [this.userPetInfo.userPet.id, this.prop_id], (res) => {
                        if (res.code == 200) {
                            let userPet: UserPet = res.data.userPet;
                            let userProp: UserProp = res.data.userProp;
                            JCTool.updateObject(this.userPetInfo, GlobalData.createUserPetInfo(userPet));
                            GlobalData.updateUserPropInfos([userProp]);
                            this.target.updateBagItem();
                            this.updatePanel();
                            this.target.renderDisplayStatusList(this.userPetInfo.userPet, this.userPetInfo.strength);
                        }
                    });
                } else {
                    Camper.getInstance().showToast("该经验便当用完了");
                }               
            } else {
                Camper.getInstance().showToast("请选择经验便当");
            }
        });
    }

    updatePanel() {
        let mainStatusBase = GlobalData.calculateMainStatus(this.userPetInfo.userPet.pet_level, this.userPetInfo.petInfo);
        let mainStatusNew = GlobalData.calculateMainStatus(this.userPetInfo.userPet.pet_level + 1, this.userPetInfo.petInfo);
        let mainStatusUp = [];
        for (let i = 0; i < 3; i++) {
            mainStatusUp.push(mainStatusNew[i] - mainStatusBase[i]);
        }
        let statusBaseList = this.node.getChildByName("StatusBaseList");
        statusBaseList.children[0].getComponent(cc.Label).string = "基础等级" + this.userPetInfo.userPet.pet_level;
        statusBaseList.children[1].getComponent(cc.Label).string = "生命：" + mainStatusBase[0];
        statusBaseList.children[2].getComponent(cc.Label).string = "攻击：" + mainStatusBase[1];
        statusBaseList.children[3].getComponent(cc.Label).string = "防御：" + mainStatusBase[2];
        let statusNewList = this.node.getChildByName("StatusNewList");
        statusNewList.children[0].getComponent(cc.Label).string = "基础等级" + (this.userPetInfo.userPet.pet_level + 1);
        statusNewList.children[1].getComponent(cc.Label).string = "生命：" + mainStatusNew[0];
        statusNewList.children[2].getComponent(cc.Label).string = "攻击：" + mainStatusNew[1];
        statusNewList.children[3].getComponent(cc.Label).string = "防御：" + mainStatusNew[2];
        let statusUpList = this.node.getChildByName("StatusUpList");
        statusUpList.children[1].getChildByName("Value").getComponent(cc.Label).string = "+" + mainStatusUp[0];
        statusUpList.children[2].getChildByName("Value").getComponent(cc.Label).string = "+" + mainStatusUp[1];
        statusUpList.children[3].getChildByName("Value").getComponent(cc.Label).string = "+" + mainStatusUp[2];

        this.node.getChildByName("ConsumeList").children.forEach((c: cc.Node, index: number) => {
            let prop_id = 1001 + index;
            let userPropInfo = GlobalData.getUserPropInfo(prop_id);
            if (userPropInfo) {
                c.getChildByName("Count").getChildByName("Value").getComponent(cc.Label).string = userPropInfo.userProp.amount.toString();
            } else {
                c.getChildByName("Count").getChildByName("Value").getComponent(cc.Label).string = "0";
            }
        });

        let levelExp: number[] = GlobalData.calculateLevelExp(this.userPetInfo.userPet.pet_exp);
        this.node.getChildByName("ProgressBG").getChildByName("ProgressBar").getComponent(cc.Sprite).fillRange = levelExp[0] / levelExp[1];
        this.node.getChildByName("ProgressBG").getChildByName("Text").getComponent(cc.Label).string = "经验值：" + levelExp[0] + "/" + levelExp[1];
    }
}
class BloodUp {
    target: PetPage;
    node: cc.Node;
    userPetInfo: UserPetInfo;
    prop_id: number = 1011;

    constructor(target: PetPage) {
        this.target = target;
        this.init();
        this.updatePanel();
    }

    init() {
        let childPanel = this.target.detail.getChildByName("ChildPanel");
        this.node = cc.instantiate(this.target.detail_blood);
        childPanel.addChild(this.node);
        this.userPetInfo = this.target.currentUserPetInfo;

        this.node.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            if (this.userPetInfo.userPet.blood_level >= 10) {
                Camper.getInstance().showToast("血统已满");
                return;
            }
            if (GlobalData.getUserPropInfo(this.prop_id)) {
                GlobalData.player.call("UserPetController.bloodUp", [this.userPetInfo.userPet.id], (res) => {
                    if (res.code == 200) {
                        let userPet: UserPet = res.data.userPet;
                        let userProp: UserProp = res.data.userProp;
                        JCTool.updateObject(this.userPetInfo, GlobalData.createUserPetInfo(userPet));
                        GlobalData.updateUserPropInfos([userProp]);
                        this.updatePanel();
                        this.target.renderDisplayStatusList(this.userPetInfo.userPet, this.userPetInfo.strength);
                    }
                });
            } else {
                Camper.getInstance().showToast("玲珑石已用完");
            }             
        });
    }

    updatePanel() {
        let bloodLevel = this.userPetInfo.userPet.blood_level;
        let bloodExp = this.userPetInfo.userPet.blood_exp;
        let bloodExpMax = (bloodLevel + 1) * 10;
        let statusBaseList = this.node.getChildByName("StatusBaseList");
        statusBaseList.children[0].getComponent(cc.Label).string = "血统等级" + bloodLevel;
        statusBaseList.children[1].getComponent(cc.Label).string = "生命加成：" + (bloodLevel * 3) + "%";
        statusBaseList.children[2].getComponent(cc.Label).string = "攻击加成：" + (bloodLevel * 3) + "%";
        statusBaseList.children[3].getComponent(cc.Label).string = "防御加成：" + (bloodLevel * 3) + "%";
        let statusNewList = this.node.getChildByName("StatusNewList");
        statusNewList.children[0].getComponent(cc.Label).string = "血统等级" + (bloodLevel + 1);
        statusNewList.children[1].getComponent(cc.Label).string = "生命加成：" + ((bloodLevel + 1) * 3) + "%";
        statusNewList.children[2].getComponent(cc.Label).string = "攻击加成：" + ((bloodLevel + 1) * 3) + "%";
        statusNewList.children[3].getComponent(cc.Label).string = "防御加成：" + ((bloodLevel + 1) * 3) + "%";
        let statusUpList = this.node.getChildByName("StatusUpList");
        statusUpList.children[1].getChildByName("Value").getComponent(cc.Label).string = "+3%";
        statusUpList.children[2].getChildByName("Value").getComponent(cc.Label).string = "+3%";
        statusUpList.children[3].getChildByName("Value").getComponent(cc.Label).string = "+3%";

        let userPropInfo = GlobalData.getUserPropInfo(this.prop_id);
        let countLabel = this.node.getChildByName("ConsumeList").children[0].getChildByName("Row").getChildByName("Label");
        if (userPropInfo && userPropInfo.userProp.amount > 0) {
            countLabel.color = cc.Color.GREEN;
            countLabel.getComponent(cc.Label).string = userPropInfo.userProp.amount + "/1";
        } else {
            countLabel.color = cc.Color.RED;
            countLabel.getComponent(cc.Label).string = "0/1";
        }
        
        let probability = this.node.getChildByName("Row").getChildByName("TipList").getChildByName("Value");
        if (bloodExp < bloodExpMax / 3) {
            probability.getComponent(cc.Label).string = "较低";
        } else if (bloodExp < bloodExpMax * 2 / 3) {
            probability.getComponent(cc.Label).string = "普通";
        } else {
            probability.getComponent(cc.Label).string = "较高";
        }

        if (this.userPetInfo.userPet.blood_level >= 10) {
            this.node.getChildByName("ProgressBG").getChildByName("ProgressBar").getComponent(cc.Sprite).fillRange = 1;
        this.node.getChildByName("ProgressBG").getChildByName("Text").getComponent(cc.Label).string = "血统已满";
        } else {
            this.node.getChildByName("ProgressBG").getChildByName("ProgressBar").getComponent(cc.Sprite).fillRange = bloodExp / bloodExpMax;
            this.node.getChildByName("ProgressBG").getChildByName("Text").getComponent(cc.Label).string = "血统值：" + bloodExp + "/" + bloodExpMax;
        }
    }
}
class BreakUp {
    target: PetPage;
    node: cc.Node;
    userPetInfo: UserPetInfo;
    prop_id: number = 1021;

    constructor(target: PetPage) {
        this.target = target;
        this.init();
        this.updatePanel();
    }

    init() {
        let childPanel = this.target.detail.getChildByName("ChildPanel");
        this.node = cc.instantiate(this.target.detail_break);
        childPanel.addChild(this.node);
        this.userPetInfo = this.target.currentUserPetInfo;

        this.node.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            if (this.userPetInfo.userPet.break_level >= 10) {
                Camper.getInstance().showToast("突破已满");
                return;
            }
            if (this.userPetInfo.userPet.pet_level < ((this.userPetInfo.userPet.break_level + 1) * 10)) {
                Camper.getInstance().showToast("宠物等级不足");
                return;
            }
            let userPropInfo = GlobalData.getUserPropInfo(this.prop_id);
            if (!userPropInfo) {
                Camper.getInstance().showToast("突破石已用完");
                return;
            }
            if (userPropInfo.userProp.amount < this.userPetInfo.userPet.break_level + 1) {
                Camper.getInstance().showToast("突破石不足");
                return;
            }
            if (GlobalData.userInfo.coin < (this.userPetInfo.userPet.break_level + 1) * 10000) {
                Camper.getInstance().showToast("金币不足");
                return;
            }
            if (this.userPetInfo.userPet.fragment == 0) {
                Camper.getInstance().showToast("宠物碎片不足");
                return;
            }
            GlobalData.player.call("UserPetController.breakUp", [this.userPetInfo.userPet.id], (res) => {
                if (res.code == 200) {
                    let userInfo: UserInfo = res.data.userInfo;
                    let userPet: UserPet = res.data.userPet;
                    let userProp: UserProp = res.data.userProp;
                    GlobalData.userInfo = userInfo;
                    JCTool.updateObject(this.userPetInfo, GlobalData.createUserPetInfo(userPet));
                    GlobalData.updateUserPropInfos([userProp]);
                    this.updatePanel();
                    this.target.renderDisplayStatusList(this.userPetInfo.userPet, this.userPetInfo.strength);
                }
            });           
        });
    }

    updatePanel() {
        let breakLevel = this.userPetInfo.userPet.break_level;
        let breakStatusBase = GlobalData.calculateBreakStatus(breakLevel, this.userPetInfo.petInfo.rarity);
        let breakStatusNew = GlobalData.calculateBreakStatus(breakLevel + 1, this.userPetInfo.petInfo.rarity);
        let statusBaseList = this.node.getChildByName("StatusBaseList");
        statusBaseList.children[0].getComponent(cc.Label).string = "突破等级" + breakLevel;
        statusBaseList.children[1].getComponent(cc.Label).string = "生命：+" + breakStatusBase[0];
        statusBaseList.children[2].getComponent(cc.Label).string = "攻击：+" + breakStatusBase[1];
        statusBaseList.children[3].getComponent(cc.Label).string = "防御：+" + breakStatusBase[2];
        let statusNewList = this.node.getChildByName("StatusNewList");
        statusNewList.children[0].getComponent(cc.Label).string = "突破等级" + (breakLevel + 1);
        statusNewList.children[1].getComponent(cc.Label).string = "生命：+" + breakStatusNew[0];
        statusNewList.children[2].getComponent(cc.Label).string = "攻击：+" + breakStatusNew[1];
        statusNewList.children[3].getComponent(cc.Label).string = "防御：+" + breakStatusNew[2];
        let statusUpList = this.node.getChildByName("StatusUpList");
        statusUpList.children[1].getChildByName("Value").getComponent(cc.Label).string = "+" + (breakStatusNew[0] - breakStatusBase[0]);
        statusUpList.children[2].getChildByName("Value").getComponent(cc.Label).string = "+" + (breakStatusNew[1] - breakStatusBase[1]);
        statusUpList.children[3].getChildByName("Value").getComponent(cc.Label).string = "+" + (breakStatusNew[2] - breakStatusBase[2]);

        let userPropInfo = GlobalData.getUserPropInfo(this.prop_id);
        let countLabel1 = this.node.getChildByName("ConsumeList").children[0].getChildByName("Row").getChildByName("Label");
        if (userPropInfo && userPropInfo.userProp.amount >= breakLevel + 1) {
            countLabel1.color = cc.Color.GREEN;
            countLabel1.getComponent(cc.Label).string = userPropInfo.userProp.amount + "/" + (breakLevel + 1);
        } else {
            countLabel1.color = cc.Color.RED;
            countLabel1.getComponent(cc.Label).string = "0/"  + (breakLevel + 1);
        }
        let countLabel2 = this.node.getChildByName("ConsumeList").children[1].getChildByName("Row").getChildByName("Label");
        if (this.userPetInfo.userPet.fragment > 0) {
            countLabel2.color = cc.Color.GREEN;
            countLabel2.getComponent(cc.Label).string = this.userPetInfo.userPet.fragment + "/1";
        } else {
            countLabel2.color = cc.Color.RED;
            countLabel2.getComponent(cc.Label).string = "0/1";
        }
        let base = this.node.getChildByName("ConsumeList").children[1].getChildByName("Base").getComponent(cc.Sprite);
        let avatar = this.node.getChildByName("ConsumeList").children[1].getChildByName("Avatar").getComponent(cc.Sprite);
        let frame = this.node.getChildByName("ConsumeList").children[1].getChildByName("Frame").getComponent(cc.Sprite);
        let frameAndBase = ResourceMgr.getFrameAndBase(this.userPetInfo.petInfo.rarity);
        base.spriteFrame = frameAndBase[1];
        frame.spriteFrame = frameAndBase[0];
        avatar.spriteFrame = ResourceMgr.getPetAvatar(this.userPetInfo.petInfo.id);
        this.node.getChildByName("ConsumeCoin").getChildByName("Layout").getChildByName("Label").getComponent(cc.Label).string = ((breakLevel + 1) * 10000).toString();
        this.node.getChildByName("Tip").getChildByName("Label").getComponent(cc.Label).string = "【突破】需要基础等级达到" + ((breakLevel + 1) * 10) + "级";
    }
}
class Equipment {
    target: PetPage;
    node: cc.Node;
    userPetInfo: UserPetInfo;
    EquipmentList: cc.Node;

    constructor(target: PetPage) {
        this.target = target;
        this.init();
        this.updatePanle();
    }

    init() {
        let childPanel = this.target.detail.getChildByName("ChildPanel");
        this.node = cc.instantiate(this.target.detail_equipment);
        childPanel.addChild(this.node);
        this.userPetInfo = this.target.currentUserPetInfo;
        this.EquipmentList = this.node.getChildByName("EquipmentList");
        cc.tween(this.node.getChildByName("Wheel")).repeatForever(cc.rotateBy(10, 360)).start();
        cc.tween(this.node.getChildByName("Switch")).repeatForever(cc.rotateBy(10, -360)).start();
        this.EquipmentList.children.forEach((c, i) => {
            c.on(cc.Node.EventType.TOUCH_END, () => {
                let pageInfo = GameMgr.pageStack[GameMgr.pageStack.length - 1];
                pageInfo.name = "EquipmentSelect";
                let node = cc.instantiate(this.target.detail_equipmentSelect);
                (pageInfo as any).tempNode = node;
                this.target.node.addChild(node);
                let equipmentSelect = node.getComponent(EquipmentSelect);
                if (this.userPetInfo.userEquipmentInfos[i]) {
                     equipmentSelect.activeRemove(this.userPetInfo, i, this);
                     
                } else {
                    equipmentSelect.activeEquip(this.userPetInfo, i, this);
                }
            });
        });
    }

    updatePanle() {
        this.target.renderDisplayStatusList(this.userPetInfo.userPet, this.userPetInfo.strength);
        for (let i = 0; i < 6; i++) {
            if (this.userPetInfo.userEquipmentInfos[i]) {
                let userEquipmentInfo = this.userPetInfo.userEquipmentInfos[i];
                let frameAndBase = ResourceMgr.getFrameAndBase(userEquipmentInfo.equipmentInfo.rarity);
                let item = this.EquipmentList.children[i];
                item.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                item.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                item.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getEquipmentAvatar(userEquipmentInfo.equipmentInfo.id);
                item.getChildByName("Plus").active = false;
                item.getChildByName("Stars").children.forEach((c, index) => {
                    if (index < userEquipmentInfo.userEquipment.star_level) {
                        c.active = true;
                    } else {
                        c.active = false;
                    }
                });
                let rowCount = item.getChildByName("RowCount");
                if (userEquipmentInfo.userEquipment.strength_level > 0) {
                    rowCount.active = true;
                    item.getChildByName("RowName").getChildByName("Label").color = cc.color(55, 255, 55);
                    rowCount.getChildByName("Label").getComponent(cc.Label).string = 
                        "+" + userEquipmentInfo.userEquipment.strength_level;
                } else {
                    rowCount.active = false;
                }
                item.getChildByName("RowName").getChildByName("Label").getComponent(cc.Label).string = 
                    userEquipmentInfo.equipmentInfo.name;
                item.getChildByName("RowName").getChildByName("Label").color = cc.Color.GREEN;
            } else {
                let frameAndBase = ResourceMgr.getFrameAndBase("N");
                let item = this.EquipmentList.children[i];
                item.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                item.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                item.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = null;
                item.getChildByName("Plus").active = true;
                item.getChildByName("Stars").children.forEach(c => {
                    c.active = false;
                });
                item.getChildByName("RowCount").active = false;
                let names = ["护目", "手镯", "头饰", "项链", "尖牙", "星石"];
                item.getChildByName("RowName").getChildByName("Label").color = cc.Color.GRAY;
                item.getChildByName("RowName").getChildByName("Label").getComponent(cc.Label).string = names[i];
            }
        }
    }
}
