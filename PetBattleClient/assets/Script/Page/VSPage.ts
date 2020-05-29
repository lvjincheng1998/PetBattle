import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";
import BattleMgr from "../Manager/BattleMgr";

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
        GlobalData.player.call("RankController.getUserIntegral", [GlobalData.userInfo.id], (integral) => {
            GlobalData.player.call("BattleMgr.match", [GlobalData.userEmbattleInfos, integral]);
        });
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
        cc.loader.load(GlobalData.userInfo.avatarUrl, (err, texture) => {
            if (!err) {
                this.node.getChildByName("HeadPhotoLeft").getChildByName("HeadPhoto").getComponent(cc.Sprite).spriteFrame = 
                    new cc.SpriteFrame(texture);
            }
        });
    }

    renderOtherHeadPhoto(userIfno: UserInfo) {
        let headPhoto = this.node.getChildByName("HeadPhotoRight");
        headPhoto.active = true;
        cc.loader.load(userIfno.avatarUrl, (err, texture) => {
            if (!err) {
                headPhoto.getChildByName("HeadPhoto").getComponent(cc.Sprite).spriteFrame = 
                    new cc.SpriteFrame(texture);
            }
        });
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
            let strs = otherUserInfo.avatarUrl.split("/");
            strs.pop();
            strs.pop();
            strs.push("pet_battle", Math.random() < 0.5 ? "6901.jpg" : "6902.jpg");
            otherUserInfo.avatarUrl = strs.join("/");
            otherUserInfo.nickname = "机器人玩家";
            
            let old_embattle = [];
            let new_embattle = [];
            otherEmbattle.forEach((elem) => {
                if (elem) {
                    old_embattle.push(elem);
                    new_embattle.push(elem);
                }
            });
            while (new_embattle.length < otherEmbattle.length) {
                let base = old_embattle[Math.floor(Math.random() * old_embattle.length)];
                let copy = JSON.parse(JSON.stringify(base));
                new_embattle.push(copy);
            }
            for (let embattle of new_embattle) {
                embattle.userPetInfo.petInfo = ResourceMgr.petInfos[Math.floor(Math.random() * ResourceMgr.petInfos.length)];
                embattle.userPetInfo.petInfo = JSON.parse(JSON.stringify(embattle.userPetInfo.petInfo));
            }
            otherEmbattle = new_embattle;
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
}
