import { JCEntity } from "../SDK/JCEngine";
import { Random } from "../SDK/Random";
import GlobalData from "../Common/GlobalData";
import VSPage from "../Page/VSPage";
import DragonBone from "../Component/DragonBone";
import BattleMgr from "../Manager/BattleMgr";
import GameMgr from "../Manager/GameMgr";
import ResourceMgr from "../Manager/ResourceMgr";
import FriendPage from "../Page/FriendPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends JCEntity {

    onLoad() {
        GlobalData.player = this;
        window.player = this;
    }

    matchSuccess(otherUserInfo, otherEmbattle, selfSide) {
        VSPage.instance.matchSuccess(otherUserInfo, otherEmbattle, selfSide);
    }

    setFrameRate(frameRate: number) {
        DragonBone.setFrameRate(frameRate);
    }

    step(seed1: number, seed2: number, skillPetIndexes) {
        Random.setSeed(seed1, seed2);
        window.battleMgr.skillPetIndexes = skillPetIndexes;
        window.battleMgr.updateFrame();
    }

    skill(petIndex: number) {
        this.call("skill", [petIndex]);
    }

    test() {
        this.call("TestController.test", [null], (res) => {console.log(res)})
    }

    showRes(result: BattleVsResult) {
        let panel = BattleMgr.instance.battleSettlement;
        let userInfos = BattleMgr.userInfos;
        let sideNodes = [panel.getChildByName("SideLeft"), panel.getChildByName("SideRight")];
        panel.getChildByName("Res").getComponent(cc.Label).string = result.res;
        for(let i in sideNodes) {
            let sideNode = sideNodes[i];
            let sideIndex = result.sideIndexes[i];
            let userInfo = userInfos[sideIndex];
            ResourceMgr.setSpriteFrame(sideNode.getChildByName("HeadPhoto").getChildByName("Sprite").getComponent(cc.Sprite), userInfo.avatarUrl);
            sideNode.getChildByName("Nickname").getComponent(cc.Label).string = userInfo.nickname;
            sideNode.getChildByName("Integral").children[0].getComponent(cc.Label).string = result.integrals[i].toString();
            if (result.integralVars[i] == 0) {
                sideNode.getChildByName("Integral").children[1].active = false;
            } else {
                let sign = result.integralVars[i] > 0 ? "+" : "";
                sideNode.getChildByName("Integral").children[1].getComponent(cc.Label).string = "(" + sign + result.integralVars[i] + ")";
            }
        }
        panel.getChildByName("BtnBack").on(cc.Node.EventType.TOUCH_END, () => {
            GameMgr.enterGame();
        });
        panel.zIndex = 1000 + 1;
        panel.active = true;
        panel.y = cc.winSize.height / 2 + panel.height / 2;
        panel.runAction(cc.moveTo(1, cc.v2(0, 0)).easing(cc.easeBackInOut()));
        
        let block = new cc.Node();
        cc.find("Canvas").addChild(block);
        block.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes("Texture/Common/White", cc.SpriteFrame);
        block.color = cc.Color.BLACK;
        block.opacity = 0;
        block.addComponent(cc.BlockInputEvents);
        block.setContentSize(cc.winSize);
        block.zIndex = 1000;
        cc.tween(block).to(0.5, {opacity: 75}).start();
    }

    inputOrder(order) {
        if (order == "output all pets name") {
            let output = [];
            ResourceMgr.petInfos.forEach(petInfo => {
                output.push(petInfo.name)
            });
            console.log(output.join("、"));
        }
    }

    receivePrivateMsg(friendChat) {
        FriendPage.pushPrivateMsg(friendChat);
    }

    receivePublicMsg(friendChatPublic) {
        FriendPage.pushPublicMsg(friendChatPublic);
    }

    updateUserInfo(userInfo) {
        GlobalData.userInfo = userInfo;
    }
}
interface BattleVsResult {
    res: string;
    sideIndexes: number[];
    integrals: number[];
    integralVars: number[];
}
