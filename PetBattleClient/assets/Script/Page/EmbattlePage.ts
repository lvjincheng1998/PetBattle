import DragonBone from "../Component/DragonBone";
import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EmbattlePage extends cc.Component {
    //bag
    @property({type: cc.Node})
    bag: cc.Node = null;
    @property({type: cc.Node})
    btnRank: cc.Node = null;
    @property({type: cc.Label})
    bagLabelValue: cc.Label = null;
    @property({type: cc.Node})
    bagContent: cc.Node = null;
    @property({type: cc.Node})
    bagContentItem: cc.Node = null;
    //embattle
    @property({type: cc.Label})
    embattleLabel: cc.Label = null;
    @property({type: cc.Node})
    embattleContent: cc.Node = null;

    isShowingRank: boolean = false;

    onLoad() {
        this.btnRank.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.isShowingRank) {
                this.isShowingRank = false;
            } else {
                this.isShowingRank = true;
            }
        });
        this.rankBag(null, "rarity");
        this.embattleContent.children.forEach((c: cc.Node, index: number) => {
            c.on(cc.Node.EventType.TOUCH_END, () => {
                if (GlobalData.userEmbattleInfos[index]) {
                    GlobalData.player.call("UserEmbattleController.removePet", 
                    [GlobalData.userEmbattleInfos[index].userEmbattle.id], 
                    (res) => {
                        GlobalData.setEmbattleInfos(res);
                        this.updateStrength();
                        this.embattleContent.children[index].getChildByName("PetModel").removeComponent(DragonBone);
                        this.embattleContent.children[index].getChildByName("PetModel").removeComponent(dragonBones.ArmatureDisplay);
                        this.updateBag();
                    });
                }
            });
        });
        this.updateEmbattle();
    }

    updateEmbattle() {
        this.embattleContent.children.forEach((c: cc.Node, index: number) => {
            c.getChildByName("PetModel").removeComponent(DragonBone);
            c.getChildByName("PetModel").removeComponent(dragonBones.ArmatureDisplay);
            this.scheduleOnce(() => {
                if (GlobalData.userEmbattleInfos[index]) {
                    c.getChildByName("PetModel").addComponent(DragonBone).init(
                        ResourceMgr.getPetUrl(GlobalData.userEmbattleInfos[index].userPetInfo.petInfo.id)
                    ).playAnimation("stand", 0);
                }
            }, 0);
        });
        this.updateStrength();
    }

    updateStrength() {
        let strength = 0;
        for (let userEmbattleInfo of GlobalData.userEmbattleInfos) {
            if (userEmbattleInfo) {
                strength += userEmbattleInfo.userPetInfo.strength;
            }
        }
        this.embattleLabel.string = "战斗力:" + strength;
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
            item.getChildByName("Tag").active = GlobalData.isOnEmbattle(userPet.id) ? true : false;
            item.on(cc.Node.EventType.TOUCH_END, () => {
                for (let child of this.bagContent.children) {
                    let frameNode = child.getChildByName("frameNode-xxx");
                    if (frameNode) {
                        frameNode.destroy();
                    }
                }
                let frameNode = new cc.Node("frameNode-xxx");
                frameNode.y = 4;
                frameNode.addComponent(DragonBone).init("DragonBone/Common/Frame").playAnimation("run", 0);
                item.addChild(frameNode);
                if (!GlobalData.isOnEmbattle(userPetInfo.userPet.id)) {
                    for (let i = 0; i < 6; i++) {
                        if (!GlobalData.userEmbattleInfos[i]) {
                            GlobalData.player.call("UserEmbattleController.addPet", [i, userPetInfo.userPet.id], (res) => {
                                GlobalData.setEmbattleInfos(res);
                                this.updateStrength();
                                this.embattleContent.children[i].getChildByName("PetModel").addComponent(DragonBone).init(
                                    ResourceMgr.getPetUrl(GlobalData.userEmbattleInfos[i].userPetInfo.petInfo.id)
                                ).playAnimation("stand", 0);
                                item.getChildByName("Tag").active = GlobalData.isOnEmbattle(userPet.id) ? true : false;
                            });
                            break;
                        }
                    }
                }
            });
        }
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
