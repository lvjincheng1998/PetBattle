import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({type: cc.Node})
    panelReady: cc.Node = null;
    @property({type: cc.Label})
    panelReady_bannerLabel: cc.Label = null;
    @property({type: cc.Node})
    awardListArr: cc.Node[] = [];

    currentTheme: string;
    
    onLoad() {
        this.panelReady.getChildByName("BackGround").on(cc.Node.EventType.TOUCH_END, () => {
            this.panelReady.active = false;
        });
    }

    prepare(e: cc.Event.EventTouch) {
        this.panelReady.active = true;

        let labelName = e.getCurrentTarget().getChildByName("Label").getComponent(cc.Label).string;
        this.currentTheme = labelName;
        this.panelReady_bannerLabel.string = labelName;
        this.awardListArr.forEach(c => {
            c.active = false;
        });
        if (labelName == "玲珑塔") {
            this.awardListArr[0].active = true;
        } else if (labelName == "武斗场") {
            this.awardListArr[1].active = true;
        } else if (labelName == "元武库") {
            this.awardListArr[2].active = true;
        }
    }

    challenge() {
        Camper.getInstance().showToast("只能在活动期间进入");
    }
}
