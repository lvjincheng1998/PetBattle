import Pet from "../Pet/Pet";
import AudioMgr from "./AudioMgr";
import FrameAction from "../SDK/FrameAction";
import DragonBone from "../Component/DragonBone";
import GlobalData from "../Common/GlobalData";
import GameMgr from "./GameMgr";
import { Random } from "../SDK/Random";
import Camper from "../Common/Camper";
import ResourceMgr from "./ResourceMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleMgr extends cc.Component {
    @property({type: cc.Node})
    backGroundNode: cc.Node = null;
    @property({type: cc.Sprite})
    hpLeft: cc.Sprite = null;
    @property({type: cc.Sprite})
    hpRight: cc.Sprite = null;
    @property({type: cc.Sprite})
    headPhotoLeft: cc.Sprite = null;
    @property({type: cc.Sprite})
    headPhotoRight: cc.Sprite = null;
    @property({type: cc.Node})
    battleSettlement: cc.Node = null;

    winWidth: number = 0;

    roundDriver: RoundDriver;
    superBackGround: SuperBackGround;
    skillPanel: SkillPanel;

    pets: Pet[] = new Array(12);
    static selfSide: number = -1;
    static userInfos: UserInfo[];
    
    skillPetIndexes: number[] = [];
    
    petInfos: PetInfo[];
    petAnimationInfos: any;
    skillAnimationInfos: any;

    defaultHeadPhoto: string = "data:image/jpg;base64,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";

    static SIDE_LEFT: number = 0;
    static SIDE_RIGHT: number = 1;

    static online: boolean = false;

    static instance: BattleMgr;

    onLoad() {
        window.battleMgr = this;
        BattleMgr.instance = this;

        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        this.winWidth = cc.winSize.width > this.backGroundNode.width ? this.backGroundNode.width : cc.winSize.width;
        this.node.addComponent(AudioMgr);

        cc.loader.loadResDir("", () => {
            this.petInfos = cc.loader.getRes("Config/PetInfo", cc.JsonAsset).json;
            this.petAnimationInfos = cc.loader.getRes("Config/AnimationInfo/Pet", cc.JsonAsset).json;
            this.skillAnimationInfos = cc.loader.getRes("Config/AnimationInfo/Skill", cc.JsonAsset).json;

            if (BattleMgr.selfSide == -1) {
                BattleMgr.selfSide = 0;
            }

            this.generatePets();

            this.roundDriver = new RoundDriver(this);
            this.superBackGround = new SuperBackGround(this);
            this.skillPanel = new SkillPanel(this);

            this.updateHp();

            if (BattleMgr.online) {
                GlobalData.player.call("start");
            } else {
                this.unschedule(this.updateFrame);
                DragonBone.setFrameRate(30);
                this.schedule(this.updateFrame, 0.033);
                this.schedule(() => {
                    for (let pet of this.pets) {
                        if (pet && pet.isRight() && pet.isStand()) {
                            if (pet.releaseSkill().pass) {
                                break;
                            }
                        }
                    }
                }, 0.3);
            }
        });

        if (BattleMgr.userInfos) {
            ResourceMgr.setSpriteFrame(this.headPhotoLeft, BattleMgr.userInfos[0].avatarUrl);
            ResourceMgr.setSpriteFrame(this.headPhotoRight, BattleMgr.userInfos[1].avatarUrl);
        } else {
            this.setImageBase64(this.defaultHeadPhoto, (texture: cc.Texture2D) => {
                this.headPhotoLeft.spriteFrame = new cc.SpriteFrame(texture);
            });
            this.setImageBase64(this.defaultHeadPhoto, (texture: cc.Texture2D) => {
                this.headPhotoRight.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    updateFrame() {
        if (!BattleMgr.online) {
            Random.setSeed(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
        }
        FrameAction.update();
        DragonBone.update();
        this.roundDriver.update();
        this.superBackGround.update();
        this.skillPanel.update();
        this.pets.forEach(pet => {
            if (pet) {
                pet.updatePet();
            }
        });
    }

    updateHp() {
        for (let pet of this.pets) {
            if (!pet) {
                continue;
            }
            pet.node.on(Pet.EVENT_HP, () => {
                let maxHpLeft = 0;
                let maxHpRight = 0;
                let hpLeft = 0;
                let hpRight = 0;
                for (let pet of this.pets) {
                    if (!pet) {
                        continue;
                    }
                    if (pet.isLeft()) {
                        maxHpLeft += pet.status_hp;
                        hpLeft += pet.state_hp;
                    }
                    if (pet.isRight()) {
                        maxHpRight += pet.status_hp;
                        hpRight += pet.state_hp;
                    }
                }
                if (this.hpLeft.fillRange != hpLeft / maxHpLeft) {
                    cc.tween(this.hpLeft).to(0.3, {fillRange: hpLeft / maxHpLeft}).start();
                }
                if (this.hpRight.fillRange != hpRight / maxHpRight) {
                    cc.tween(this.hpRight).to(0.3, {fillRange: hpRight / maxHpRight}).start();
                }
            });
        }
    }

    setImageBase64(base64Url: string, callback:Function) {
        let img = new Image();
        img.src = base64Url;
        img.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(img);
            texture.handleLoadedTexture();
            if (callback instanceof Function) {
                callback(texture);
            }
        }
    }

    isSelfSide(pet: Pet): boolean {
        if (BattleMgr.selfSide == 0) {
            if (pet.index < 6) {
                return true;
            }
        } else {
            if (pet.index > 5) {
                return true;
            }
        }
        return false;
    }

    getPetInfo(petId: number): PetInfo {
        for (let i = 0; i < this.petInfos.length; i++) {
            if (this.petInfos[i].id == petId) {
                return this.petInfos[i];
            }
        }
    }
    
    static doublePetInfo;

    generatePets() {
        let petInfos: PetInfo[] = [];
        if (BattleMgr.doublePetInfo) {
            petInfos = BattleMgr.doublePetInfo;
        } else {
            let ids = [6113,null,6113,6113,6113,6113, null,6113,6113,6113,6113, null];
            for (let i = 0; i < 12; i++) {
                if (!ids[i]) {
                    continue
                }
                let petInfo: PetInfo = JSON.parse(JSON.stringify(this.getPetInfo(ids[i % ids.length])));
                petInfo.status.hp *= 11;
                petInfo.status.attack *= 23;
                petInfo.status.defend *= 20;
                petInfo.index = i;
                petInfos[i] = petInfo;
            }
        }
        for (let i = 0; i < petInfos.length; i++) {
            let petInfo = petInfos[i];
            if (!petInfo) {
                continue;
            }
            this.pets[petInfo.index] = this.addPet(petInfo.id, petInfo.index, petInfo.status);
        }
    }

    addPet(id: number, index: number, status: PetStatus): Pet {
        let node = new cc.Node();
        let pet = node.addComponent("Pet" + id).init(id, index, status);
        this.node.addChild(node);
        return pet;
    }
}
class SuperBackGround {
    battleMgr: BattleMgr;
    isSuper: boolean = false;

    constructor(battleMgr: BattleMgr) {
        this.battleMgr = battleMgr;
    }

    update() {
        this.checkSuper();
        if (this.isSuper) {
            if (this.battleMgr.backGroundNode.opacity > 55) {
                this.battleMgr.backGroundNode.opacity -= 20;
            }
        } else {
            if (this.battleMgr.backGroundNode.opacity < 255) {
                this.battleMgr.backGroundNode.opacity += 20;
            }
        }
    }

    checkSuper() {
        for (let i = 0; i < this.battleMgr.pets.length; i++) {
            if (this.battleMgr.pets[i] && this.battleMgr.pets[i].superSkilling) {
                this.isSuper = true;
                break;
            }
            if (i == this.battleMgr.pets.length - 1) {
                this.isSuper = false;
            }
        }
    }
}
class RoundDriver {
    battleMgr: BattleMgr;
    queue: Pet[] = [];
    survivalLeft: number = 0;
    survivalRight: number = 0;
    canDrive: boolean = true;
    gameOver: boolean;
    lockUpdate: boolean;

    cyclingTrack: CyclingTrack;

    constructor(battleMgr: BattleMgr) {
        this.battleMgr = battleMgr;
        this.cyclingTrack = new CyclingTrack(battleMgr);
    }

    update() {
        if (this.lockUpdate) {
            return;
        }
        if (this.gameOver) {
            let hasDoing =false;
            for (let pet of this.battleMgr.pets) {
                if (pet && pet.doing) {
                    hasDoing = true;
                    break;
                }
            }
            if (!hasDoing) {
                this.lockUpdate = true;
                //upload game res
                let userVsRank = this.getUserVsRank();
                let res = [this.survivalLeft, this.survivalRight];
                GlobalData.player.call("setRes", [res, userVsRank]);
            }
            return;
        }
        this.survivalLeft = 0;
        this.survivalRight = 0;
        this.canDrive = true;

        this.battleMgr.pets.forEach((pet: Pet) => {
            if (!pet) {
                return;
            }
            if (!pet.dead) {
                if (pet.isLeft()) {
                    this.survivalLeft++;
                } else if (pet.isRight()) {
                    this.survivalRight++;
                }
            }
            if (pet.doing || pet.skilling) {
                this.canDrive = false;
            }
        });

        if (this.survivalLeft == 0|| this.survivalRight == 0) {
            this.gameOver = true;
            this.canDrive = false;
        }

        if (this.canDrive) {
            this.cyclingTrack.takeActionPet().launch();
        }
    }

    getUserVsRank(): UserVsRank {
        let userVsRank: UserVsRank = {
            id: 0,
            user_id: GlobalData.userInfo.id,
            nickname: GlobalData.userInfo.nickname,
            avatarUrl:  GlobalData.userInfo.avatarUrl,
            pet_ids: [],
            pet_levels: [],
            strength: 0,
            integral: 0,
            create_time: undefined,
            //extra
            petInfos: undefined
        }; 
        GlobalData.userEmbattleInfos.forEach((item, i) => {
            userVsRank.pet_ids[i] = item ? item.userPetInfo.petInfo.id : null;
            userVsRank.pet_levels[i] = item ? item.userPetInfo.userPet.pet_level : null;
            userVsRank.strength += item ? item.userPetInfo.strength : 0;
        });
        userVsRank.pet_ids = JSON.stringify(userVsRank.pet_ids) as any;
        userVsRank.pet_levels = JSON.stringify(userVsRank.pet_levels) as any;
        return userVsRank;
    }
}
class CyclingTrack {
    battleMgr: BattleMgr;
    actionPets: Pet[] = [];
    trackLength: number = 360 * 1000;

    constructor(battleMgr: BattleMgr) {
        this.battleMgr = battleMgr;
    }

    takeActionPet(): Pet {
        while (this.actionPets.length > 0) {
            let actionPet = this.actionPets.shift();
            if (!actionPet.dead) {
                return actionPet;
            }
        }
        this.updateActionPets();
        return this.actionPets.shift();
    }

    updateActionPets() {
        let rankPets: Pet[] = [];
        for (let pet of this.battleMgr.pets) {
            if (pet && !pet.dead) {
                rankPets.push(pet);
            }
        }
        for (let pet of rankPets) {
            let distance = this.trackLength - pet.track_position;
            pet.track_end_need_time = Math.floor(distance / pet.state_speed);
        }
        rankPets.sort((a, b) => {
            return a.track_end_need_time - b.track_end_need_time;
        });
        let track_end_need_time = rankPets[0].track_end_need_time;
        for (let pet of rankPets) {
            pet.track_position += track_end_need_time * pet.state_speed;
        }
        for (let pet of rankPets) {
            if (pet.track_end_need_time == track_end_need_time) {
                pet.track_position = 0;
                pet.track_end_need_time = 0;
                this.actionPets.push(pet);
            } else {
                break;
            }
        }
        this.actionPets.sort(() => {
            return Random.nextInt(100) - 50;
        });
    }
}
class SkillPanel {
    battleMgr: BattleMgr;
    bodyPhoto: cc.Node;
    node: cc.Node;

    constructor(battleMgr: BattleMgr) {
        this.battleMgr = battleMgr;

        this.node = this.battleMgr.node.getChildByName("SkillPanel");
        this.node.zIndex = 1000;
        
        let item = this.node.children[0];
        for (let pet of this.battleMgr.pets) {
            if (!pet) {
                continue;
            }
            if (this.battleMgr.isSelfSide(pet)) {
                let copy = cc.instantiate(item);
                this.node.addChild(copy);
                copy.active = true;
                copy.getChildByName("Photo").getComponent(cc.Sprite).spriteFrame = 
                    cc.loader.getRes("Texture/Icon/PetHeadPhoto/" + pet.id, cc.SpriteFrame);
                copy.on(cc.Node.EventType.TOUCH_END, () => {
                    if (this.battleMgr.roundDriver.gameOver) {
                        return;
                    }
                    if (BattleMgr.online) {
                        GlobalData.player.skill(pet.index);
                    } else {
                        let res = pet.releaseSkill();
                        if (!res.pass) {
                            Camper.getInstance().showToast(res.msg);
                        }
                    }
                });
                pet.node.on(Pet.EVENT_ENERGY, () => {
                    if (pet.isFullEnergy()) {
                        copy.getChildByName("Fire").active = true;
                    } else {
                        copy.getChildByName("Fire").active = false;
                    }
                });
                pet.node.on(Pet.EVENT_HP, () => {
                    if (pet.state_hp > 0) {
                        copy.getChildByName("Fire").opacity = 255;
                        copy.opacity = 255;
                    } else {
                        copy.getChildByName("Fire").opacity = 0;
                        copy.opacity = 125;
                    }
                });
            }
        }
    }

    update() {
        for (let skillPetIndex of this.battleMgr.skillPetIndexes) {
            if (this.battleMgr.superBackGround.isSuper) {
                break;
            }
            let res = this.battleMgr.pets[skillPetIndex].releaseSkill();
            if (res.pass) {
                break;
            } else {
                if (this.battleMgr.isSelfSide(this.battleMgr.pets[skillPetIndex])) {
                    Camper.getInstance().showToast(res.msg);
                }
            }
        }
        if (this.battleMgr.superBackGround.isSuper) {
            this.node.active = false;
        } else {
            this.node.active = true;
        }
    }

    showBodyPhoto(pet: Pet) {
        if (this.bodyPhoto && this.bodyPhoto.isValid) {
            this.bodyPhoto.destroy();
        }
        let node = new cc.Node();
        this.battleMgr.node.addChild(node);
        node.addComponent(cc.Sprite).spriteFrame
            = cc.loader.getRes("Texture/Icon/PetBodyPhoto/" + pet.id, cc.SpriteFrame);
        node.setAnchorPoint(1, 0);
        node.setPosition(
            (pet.index < 6 ? -1 : 1) * (this.battleMgr.winWidth / 2) + 10, 
            -(cc.winSize.height / 2) + 10
        );
        node.scaleX = pet.index < 6 ? 1 : -1;
        node.zIndex = 1000;
        node.runAction(cc.sequence(
            cc.moveBy(0.3, cc.v2((pet.index < 6 ? 1 : -1) * node.width, 0)), 
            cc.delayTime(1.5), 
            cc.callFunc(() => {
                this.bodyPhoto.stopAllActions();
                this.bodyPhoto.runAction(cc.sequence(
                    cc.moveBy(0.3, cc.v2((pet.index < 6 ? -1 : 1) * this.bodyPhoto.width, 0)),
                    cc.callFunc(() => {
                        this.bodyPhoto.destroy();
                    })
                ));
            }, this)
        ));
        this.bodyPhoto = node;
    }
}