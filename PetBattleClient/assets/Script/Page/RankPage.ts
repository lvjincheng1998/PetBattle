import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankPage extends cc.Component {
    @property({type: cc.Node})
    btns: cc.Node = null;
    @property({type: cc.Node})
    content: cc.Node = null;

    onLoad() {
        let tween: cc.Tween;
        this.btns.children.forEach(c => {
            c.on(cc.Node.EventType.TOUCH_END, () => {
                if (tween) {
                    tween.stop();
                }
                this.btns.children.forEach(c => {
                    let atom = c.getChildByName("Atom");
                    atom.setPosition(0, 0);
                    atom.active = false;
                });
                let atom = c.getChildByName("Atom");
                atom.active = true;
                tween = cc.tween(atom).repeatForever(cc.sequence(
                    cc.moveTo(c.height / 500, cc.v2(0, c.height)),
                    cc.moveTo(c.width / 500, cc.v2(c.width, c.height)),
                    cc.moveTo(c.height / 500, cc.v2(c.width, 0)),
                    cc.moveTo(c.width / 500, cc.v2(0, 0))
                )).start();
            });
        });

        this.btns.children[0].emit(cc.Node.EventType.TOUCH_END);

        this.content.children[0].active = false;
        
        this.loadData();
    }

    loadData() {
        GlobalData.player.call("RankController.getRanks", [], (ranks: UserVsRank[]) => {
            ranks.forEach((item, index) => {
                item.petInfos = [];
                item.pet_ids = JSON.parse((item.pet_ids as any));
                item.pet_levels = JSON.parse((item.pet_levels as any));
                item.pet_ids.forEach((pet_id, i) => {
                    if (!pet_id) {
                        return;
                    }
                    item.petInfos[i] = ResourceMgr.getPetInfo(pet_id);
                });
                this.render(item, index);
                console.log(item)
            });
        });
    }

    render(item: UserVsRank, index: number) {
        let node = cc.instantiate(this.content.children[0]);
        node.active = true;
        node.getChildByName("RankNum").getComponent(cc.Label).string = (index + 1).toString();
        ResourceMgr.setSpriteFrame(node.getChildByName("HeadPhoto").getChildByName("Avatar").getComponent(cc.Sprite), item.avatarUrl);
        node.getChildByName("Nickname").getComponent(cc.Label).string = item.nickname;
        node.getChildByName("Strength").getComponent(cc.Label).string = "战斗力:\n" + item.strength;
        node.getChildByName("PetList").children.forEach((c, i) => {
            let petInfo = item.petInfos[i];
            if (!petInfo) {
                c.active = false;
                return;
            }
            let frameAndBase = ResourceMgr.getFrameAndBase(petInfo.rarity);
            c.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
            c.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
            c.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getPetAvatar(petInfo.id);
            c.getChildByName("Rarity").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getRarity(petInfo.rarity);
            c.getChildByName("Level").getComponent(cc.Label).string = item.pet_levels[i].toString();
        });
        node.getChildByName("Integral").getChildByName("Value").getComponent(cc.Label).string = item.integral.toString();
        this.content.addChild(node);
    }
}
declare global{
    interface UserVsRank {
        id: number;
        user_id: number;
        nickname: string;
        avatarUrl: string;
        pet_ids: number[];
        pet_levels: number[];
        strength: number;
        integral: number;
        create_time: number;
        //extra
        petInfos: PetInfo[];
    }
}
