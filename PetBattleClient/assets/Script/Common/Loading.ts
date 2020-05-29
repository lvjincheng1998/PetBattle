const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    @property({type: cc.Label})
    text: cc.Label = null;

    tip: string = "";

    onLoad() {
        let count = 0;
        this.schedule(() => {
            count++;
            let content = this.tip;
            for (let i = 0; i < count % 4; i++) {
                content += ".";
            }
            this.text.string = content;
        }, 0.5);
    }

    setTip(tip: string) {
        this.tip = tip;
        this.text.string = tip;
    }
}
