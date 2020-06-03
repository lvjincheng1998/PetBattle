import Loading from "./Loading";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camper extends cc.Component {
    @property({type: cc.Prefab})
    loading: cc.Prefab = null;
    @property({type: cc.Prefab})
    toast: cc.Prefab = null;

    instance_loading: cc.Node;
    instance_toast: cc.Node;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    static getInstance(): Camper {
        return cc.find("Camper").getComponent(Camper);
    }

    showLoading(tip: string, dynamic: boolean = false) {
        let node = null;
        if (this.instance_loading && this.instance_loading.isValid) {
            node = this.instance_loading;
        } else {
            node = cc.instantiate(this.loading);
            node.zIndex = 1000;
            cc.find("Canvas").addChild(node);
            this.instance_loading = node;
        }
        node.getComponent(Loading).setTip(tip, dynamic);
    }

    hideLoading() {
        if (this.instance_loading && this.instance_loading.isValid) {
            this.instance_loading.destroy();
            this.instance_loading = null;
        }
    }

    showToast(tip: string) {
        let node: cc.Node = null;
        if (this.instance_toast && this.instance_toast.isValid) {
            node = this.instance_toast;
            node.stopAllActions();
        } else {
            node = cc.instantiate(this.toast);
            node.zIndex = 1000;
            node.setPosition(cc.v2(0, cc.winSize.height / 2 + node.height));
            cc.find("Canvas").addChild(node);
            this.instance_toast = node;
        }
        node.getChildByName("Text").getComponent(cc.Label).string = tip;
        node.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2)),
            cc.delayTime(1),
            cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2 + node.height)),
            cc.callFunc(() => {
                node.destroy();
            })
        ));
    }

    hideToast() {
        if (this.instance_toast && this.instance_toast.isValid) {
            this.instance_toast.destroy();
            this.instance_toast= null;
        }
    }
}
