import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopPage extends cc.Component {
    @property({type: cc.Label})
    timeValue: cc.Label = null;
    @property({type: cc.Node})
    content: cc.Node = null;
    @property({type: cc.Node})
    modal: cc.Node = null;

    nextRefreshTime: number;

    onLoad() {
        this.refreshGoodsList();
    }

    refreshGoodsList() {
        GlobalData.player.call("ShopController.getGoodsList", [], (res) => {
            this.nextRefreshTime = res.data.nextRefreshTime
            let goodsList = res.data.goodsList;
            for (let item of goodsList) {
                if (item.goods_type == "pet") {
                    item.goodsInfo = ResourceMgr.getPetInfo(item.goods_id);
                } else if (item.goods_type == "prop") {
                    item.goodsInfo = ResourceMgr.getPropInfo(item.goods_id);
                } else if (item.goods_type == "equipment") {
                    item.goodsInfo = ResourceMgr.getEquipmentInfo(item.goods_id);
                }
            }
            let sample = this.content.children[0];
            for (let i in goodsList) {
                let item = goodsList[i];
                let copy = this.content.children[parseInt(i) + 1];
                if (!copy) {
                    copy = cc.instantiate(sample);
                    this.content.addChild(copy);
                    copy.on(cc.Node.EventType.TOUCH_END, () => {
                        this.showModal(goodsList[i]);
                    });
                    copy.active = true;
                }
                copy.getChildByName("Name").getComponent(cc.Label).string = item.goodsInfo.name;
                copy.getChildByName("Count").getComponent(cc.Label).string = 
                    "剩余次数" + (item.max_buy - item.has_buy) +
                    "/" + item.max_buy;
                let frameAndBase = ResourceMgr.getFrameAndBase(item.goodsInfo.rarity);
                let avatar = null;
                if (item.goods_type == "pet") {
                    avatar = ResourceMgr.getPetAvatar(item.goodsInfo.id);
                } else if (item.goods_type == "prop") {
                    avatar = ResourceMgr.getPropAvatar(item.goodsInfo.id);
                } else if (item.goods_type == "equipment") {
                    avatar = ResourceMgr.getEquipmentAvatar(item.goodsInfo.id);
                }
                let goods = copy.getChildByName("Goods");
                goods.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
                goods.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
                goods.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = avatar;
                if (item.goods_type == "equipment") {
                    goods.getChildByName("Avatar").setContentSize(70, 70);
                    goods.getChildByName("Avatar").getComponent(cc.Sprite).trim = false;
                }
                goods.getChildByName("Count").getComponent(cc.Label).string = "x" + item.single_buy.toString();
                let consume = copy.getChildByName("Consume");
                consume.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getCommon(item.currency);
                consume.getChildByName("Count").getComponent(cc.Label).string = item.price;
            }
            for (let i = this.content.children.length - 1; i > goodsList.length; i--) {
                this.content.children[i].destroy();
            }
        });
    }

    buyGoods(uuid: string) {
        GlobalData.player.call("ShopController.buyGoods", [uuid], (res) => {
            this.refreshGoodsList();
            Camper.getInstance().showToast(res.msg);
            console.log(res)
            if (res.code == 200) {
                GlobalData.userInfo = res.data.userInfo;
                if (res.data.goods_type == "pet") {
                    GlobalData.addUserPetInfos([res.data.userGoods]);
                } else if (res.data.goods_type == "prop") {
                    GlobalData.updateUserPropInfos([res.data.userGoods]);
                } else if (res.data.goods_type == "equipment") {
                    GlobalData.userEquipmentInfos.push(GlobalData.createUserEquipmentInfo(res.data.userGoods));
                }
            }
        });
    }

    showModal(goodsItem: any) {
        let modal = cc.instantiate(this.modal);
        modal.active = true;
        this.node.addChild(modal);
        modal.getChildByName("Base").on(cc.Node.EventType.TOUCH_END, () => {
            modal.destroy();
        });
        modal.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            this.buyGoods(goodsItem.uuid);
            modal.destroy();
        });
        if (goodsItem.goodsInfo.introduce) {
            modal.getChildByName("Introduce").getComponent(cc.Label).string = (goodsItem.goodsInfo.introduce as string).replace("\n", "");
        } else {
            modal.getChildByName("Introduce").getComponent(cc.Label).string = "暂无介绍";
        }
        modal.getChildByName("Name").getComponent(cc.Label).string = goodsItem.goodsInfo.name;
        modal.getChildByName("Count").getComponent(cc.Label).string = 
                    "剩余次数" + (goodsItem.max_buy - goodsItem.has_buy) +
                    "/" + goodsItem.max_buy;
        let frameAndBase = ResourceMgr.getFrameAndBase(goodsItem.goodsInfo.rarity);
        let avatar = null;
        if (goodsItem.goods_type == "pet") {
            avatar = ResourceMgr.getPetAvatar(goodsItem.goodsInfo.id);
        } else if (goodsItem.goods_type == "prop") {
            avatar = ResourceMgr.getPropAvatar(goodsItem.goodsInfo.id);
        } else if (goodsItem.goods_type == "equipment") {
            avatar = ResourceMgr.getEquipmentAvatar(goodsItem.goodsInfo.id);
        }
        let goods =modal.getChildByName("Goods");
        goods.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = frameAndBase[0];
        goods.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = frameAndBase[1];
        goods.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = avatar;
        if (goodsItem.goods_type == "equipment") {
            goods.getChildByName("Avatar").setContentSize(70, 70);
            goods.getChildByName("Avatar").getComponent(cc.Sprite).trim = false;
        }
        goods.getChildByName("Count").getComponent(cc.Label).string = "x" + goodsItem.single_buy.toString();
        let consume = modal.getChildByName("Btn").getChildByName("Consume");
        consume.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = ResourceMgr.getCommon(goodsItem.currency);
        consume.getChildByName("Count").getComponent(cc.Label).string = goodsItem.price;
    }

    update() {
        let time = this.nextRefreshTime - Date.now();
        if (time > 0) {
            let second = Math.floor(time / 1000) % 60;
            let minute = Math.floor(time / (1000 * 60)) % 60;
            let hour = Math.floor(time / (1000 * 60 * 60)) % 60;
            let output = (hour > 0 ? hour + "小时" : "") + (minute > 0 ? minute + "分" : "") + second + "秒";
            this.timeValue.string = output;
        } else {
            this.timeValue.string = "正在刷新";
        }
    }
}
