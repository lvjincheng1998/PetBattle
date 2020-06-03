const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    @property({type: cc.Label})
    text: cc.Label = null;

    tip: string = "";
    count: number = 0;
    dynamic: boolean = false;

    setTip(tip: string, dynamic: boolean) {
        this.tip = tip;
        this.text.string = tip;
        this.count = 0;
        if (dynamic) {
            if (!this.dynamic) {
                this.schedule(this.pointDynamic, 0.5);
            }
        } else {
            this.unschedule(this.pointDynamic);
        }
        this.dynamic = dynamic;
    }

    private pointDynamic() {
        this.count++;
        let content = this.tip;
        for (let i = 0; i < this.count % 4; i++) {
            content += ".";
        }
        this.text.string = content;
    }
}
