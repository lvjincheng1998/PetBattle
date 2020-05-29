const {ccclass, property} = cc._decorator;

@ccclass
export default class Modal extends cc.Component {
    listener_left: Function;
    listener_right: Function;

    onLoad() {
        this.node.getChildByName("Panel").getChildByName("BtnLeft").on(cc.Node.EventType.TOUCH_END, () => {
            if (this.listener_left instanceof Function) {
                this.listener_left();
            }
        });
        this.node.getChildByName("Panel").getChildByName("BtnRight").on(cc.Node.EventType.TOUCH_END, () => {
            if (this.listener_right instanceof Function) {
                this.listener_right();
            }
        });
    }

    setTitle(text: string) {
        this.node.getChildByName("Panel").getChildByName("Title").getComponent(cc.Label).string = text;
    }

    setContent(text: string) {
        this.node.getChildByName("Panel").getChildByName("Content").getComponent(cc.Label).string = text;
    }

    addToContent(node: cc.Node) {
        this.node.getChildByName("Panel").getChildByName("Content").getComponent(cc.Label).string = "";
        this.node.getChildByName("Panel").getChildByName("Content").addChild(node);
    }

    setBtnLeft(text: string) {
        this.node.getChildByName("Panel").getChildByName("BtnLeft").getChildByName("Label").getComponent(cc.Label).string = text;
    }

    setBtnRight(text: string) {
        this.node.getChildByName("Panel").getChildByName("BtnRight").getChildByName("Label").getComponent(cc.Label).string = text;
    }
    
    listenBtnLeft(callback: Function) {
        this.listener_left = callback;
    }

    listenBtnRight(callback: Function) {
        this.listener_right = callback;
    }
}
