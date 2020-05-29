const {ccclass, property} = cc._decorator;

@ccclass
export default class PetCulturePage extends cc.Component {
    @property({type: cc.Node})
    backGround: cc.Node = null;
    @property({type: cc.Node})
    node_petPhotoList: cc.Node = null;
    @property({type: cc.Node})
    node_itemList: cc.Node = null;
    @property({type: cc.Node})
    node_areaCenter: cc.Node = null;

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        this.backGround.width = cc.winSize.width;
        this.node_petPhotoList.x = -cc.winSize.width / 2 + 10;
        this.node_itemList.x = cc.winSize.width / 2 - 30;
        this.node_areaCenter.x = (this.node_petPhotoList.x + this.node_petPhotoList.width + this.node_itemList.x - this.node_itemList.width + 10) / 2;
    }

    start() {
        this.node.getChildByName("AreaCenter4").scale = cc.winSize.width / cc.view.getDesignResolutionSize().width;
        cc.loader.loadResDir("Texture/Icon", () => {
            this.node.getChildByName("PetPhotoList").children.forEach((node: cc.Node) => {
                node.getChildByName("AreaBodyPlus").active = false;
                
                let s1 = new cc.Node();
                node.addChild(s1);
                s1.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes("Texture/Icon/HalfArea/AreaBody6", cc.SpriteFrame);
                s1.x = node.width / 2;
                
                let s2 = new cc.Node();
                s1.addChild(s2);
                s2.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes("Texture/Icon/HalfPhoto/" + 6095, cc.SpriteFrame);
                s2.y = 3;
            })
        });
    }
}
