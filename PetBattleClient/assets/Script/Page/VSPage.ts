import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";
import BattleMgr from "../Manager/BattleMgr";
import JCTool from "../SDK/JCTool";
import JCLib from "../SDK/JCLib";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VSPage extends cc.Component {
    @property({type: cc.Node})
    panel: cc.Node = null;
    @property({type: cc.Node})
    atom1: cc.Node = null;
    @property({type: cc.Node})
    atom2: cc.Node = null;

    @property({type: cc.Label})
    tipText: cc.Label = null;

    static instance: VSPage;
    
    onLoad() {
        VSPage.instance = this;

        cc.tween(this.atom1).repeatForever(cc.sequence(
            cc.moveTo(this.panel.width / 1000, cc.v2(this.panel.width / 2, this.panel.height / 2)),
            cc.moveTo(this.panel.height / 1000, cc.v2(this.panel.width / 2, -this.panel.height / 2)),
            cc.moveTo(this.panel.width / 1000, cc.v2(-this.panel.width / 2, -this.panel.height / 2)),
            cc.moveTo(this.panel.height / 1000, cc.v2(-this.panel.width / 2, this.panel.height / 2))
        )).start();
        cc.tween(this.atom2).repeatForever(cc.sequence(
            cc.moveTo(this.panel.width / 1000, cc.v2(-this.panel.width / 2, -this.panel.height / 2)),
            cc.moveTo(this.panel.height / 1000, cc.v2(-this.panel.width / 2, this.panel.height / 2)),
            cc.moveTo(this.panel.width / 1000, cc.v2(this.panel.width / 2, this.panel.height / 2)),
            cc.moveTo(this.panel.height / 1000, cc.v2(this.panel.width / 2, -this.panel.height / 2))
        )).start();

        this.showSearchTip();
        this.renderMyHeadPhoto();
        this.renderMyEmbattle();
        GlobalData.player.call("BattleMgr.match", [GlobalData.userEmbattleInfos]);
    }

    showSearchTip() {
        let count = 0;
        this.schedule(() => {
            count++;
            let content = "正在搜索对手";
            for (let i = 0; i < count % 4; i++) {
                content += ".";
            }
            this.tipText.string = content;
        }, 0.3);
    }

    hideSearchTip() {
        this.tipText.node.active = false;
    }

    showReadyText() {
        this.node.getChildByName("ReadyText").active = true;
    }

    renderMyHeadPhoto() {
        ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(this.node, "HeadPhotoLeft/HeadPhoto", cc.Sprite), GlobalData.userInfo.avatarUrl);
    }

    renderOtherHeadPhoto(userInfo: UserInfo) {
        let headPhoto = this.node.getChildByName("HeadPhotoRight");
        headPhoto.active = true;
        ResourceMgr.setSpriteFrame(headPhoto.getChildByName("HeadPhoto").getComponent(cc.Sprite), userInfo.avatarUrl);
    }

    renderMyEmbattle() {
        let layout = this.node.getChildByName("LayoutLeft");
        for (let i = 0; i < GlobalData.userEmbattleInfos.length; i++) {
            let item = layout.children[i];
            let userEmbattleInfo =  GlobalData.userEmbattleInfos[i];
            if (!userEmbattleInfo) {
                item.active = false;
                continue;
            }
            let userPet = userEmbattleInfo.userPetInfo.userPet;
            let petInfo = userEmbattleInfo.userPetInfo.petInfo;
            let frameAndBase = ResourceMgr.getFrameAndBase(petInfo.rarity);
            item.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
            item.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
            item.getChildByName("Rarity").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getRarity(petInfo.rarity);
            item.getChildByName("Level").getComponent(cc.Label).string = userPet.pet_level.toString();
            item.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPetAvatar(petInfo.id);
        }
    }

    renderOtherEmbattle(embattle: UserEmbattleInfo[]) {
        let layout = this.node.getChildByName("LayoutRight");
        layout.active = true;
        for (let i = 0; i < embattle.length; i++) {
            let item = layout.children[i];
            let userEmbattleInfo =  embattle[i];
            if (!userEmbattleInfo) {
                item.active = false;
                continue;
            }
            let userPet = userEmbattleInfo.userPetInfo.userPet;
            let petInfo = userEmbattleInfo.userPetInfo.petInfo;
            let frameAndBase = ResourceMgr.getFrameAndBase(petInfo.rarity);
            item.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
            item.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
            item.getChildByName("Rarity").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getRarity(petInfo.rarity);
            item.getChildByName("Level").getComponent(cc.Label).string = userPet.pet_level.toString();
            item.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPetAvatar(petInfo.id);
        }
    }

    matchSuccess(otherUserInfo: UserInfo, otherEmbattle: UserEmbattleInfo[], selfSide: number) {
        if (GlobalData.userInfo.id == otherUserInfo.id) {
            BattleMgr.online = false;

            this.createBotEmbattle(otherUserInfo, otherEmbattle);
        } else {
            BattleMgr.online = true;
        }
        BattleMgr.selfSide = selfSide;
        BattleMgr.userInfos = [];
        let doubleEmbattle: UserEmbattleInfo[] = null;
        let myEmbattle = JSON.parse(JSON.stringify(GlobalData.userEmbattleInfos));
        if (selfSide == 0) {
            BattleMgr.userInfos = [GlobalData.userInfo, otherUserInfo];
            doubleEmbattle = myEmbattle.concat(otherEmbattle);
        } else if (selfSide = 1) {
            BattleMgr.userInfos = [otherUserInfo, GlobalData.userInfo];
            doubleEmbattle = otherEmbattle.concat(myEmbattle);
        }
        this.hideSearchTip();
        this.showReadyText();
        this.renderOtherHeadPhoto(otherUserInfo);
        this.renderOtherEmbattle(otherEmbattle);
        let doublePetInfo = [];
        for (let i in doubleEmbattle) {
            if (!doubleEmbattle[i]) {
                continue;
            }
            let petStatus = doubleEmbattle[i].userPetInfo.userPetStatus;
            let petInfo = doubleEmbattle[i].userPetInfo.petInfo;
            petInfo.index = parseInt(i);
            for (let key in petStatus) {
                petInfo.status[key] = petStatus[key][2];
            }
            doublePetInfo[i] = petInfo;
        }
        BattleMgr.doublePetInfo = doublePetInfo;
        cc.director.loadScene("Battle");
    }

    createBotEmbattle(otherUserInfo: UserInfo, otherEmbattle: UserEmbattleInfo[]) {
        let petIds = [];

        let random = Math.random();
        if (random < 0.5) {
            let strs = otherUserInfo.avatarUrl.split("/");
            strs.pop();
            if (random < 0.25) {
                strs.push("6901");
                otherUserInfo.nickname = "斗野";
            } else {
                strs.push("6902");
                otherUserInfo.nickname = "斗子";
            }
            otherUserInfo.avatarUrl = strs.join("/");
            for (let petInfo of ResourceMgr.petInfos) {
                petIds.push(petInfo.id);
            }
            JCTool.shuffleSort(petIds);
        } else {
            let petInfo = ResourceMgr.petInfos[Math.floor((random - 0.5) / 0.5 * ResourceMgr.petInfos.length)];
            for (let i = 0; i < 6; i++) {
                petIds.push(petInfo.id);
            }
            otherUserInfo.nickname = petInfo.name;
            otherUserInfo.avatarUrl = "Texture/Icon/PetHeadPhoto/" + petInfo.id;
        }
        
        let petCount = 0;
        let petLevelTotal = 0;
        let petBloodTotal = 0;
        let petBreakTotal = 0;
        otherEmbattle.forEach((elem: UserEmbattleInfo) => {
            if (elem) {
                petCount++;
                petLevelTotal += elem.userPetInfo.userPet.pet_level;
                petBloodTotal += elem.userPetInfo.userPet.blood_level;
                petBreakTotal += elem.userPetInfo.userPet.break_level;
            }
        });
        let petLevel = Math.ceil(petLevelTotal / petCount);
        let petBlood = Math.ceil(petBloodTotal / petCount);
        let petBreak = Math.ceil(petBreakTotal / petCount);

        let otherEmbattle_new = [];
        let sampleEmbattle = null;
        for (let singleEmbattle of otherEmbattle) {
            if (singleEmbattle) {
                sampleEmbattle = singleEmbattle;
                break;
            }
        }
        while(otherEmbattle_new.length < 6) {
            let copyEmbattle = JSON.parse(JSON.stringify(sampleEmbattle));
            copyEmbattle.userPetInfo = GlobalData.createUserPetInfo({
                id: 0,
                user_id: otherUserInfo.id,
                pet_id: petIds.pop(),
                pet_level: petLevel,
                blood_level: petBlood,
                break_level: petBreak,
                pet_exp: 0,
                blood_exp: 0,
                fragment: 0
            }, true);
            otherEmbattle_new.push(copyEmbattle);
        }
        for (let i in otherEmbattle_new) {
            otherEmbattle[i] = otherEmbattle_new[i];
        }
    }
}
