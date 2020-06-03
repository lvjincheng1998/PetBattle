import GlobalData from "../Common/GlobalData";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResourceMgr extends cc.Component {
    static color_custom_bule: cc.Color = cc.color(55, 155, 255);
    static color_custom_pruple: cc.Color = cc.color(225, 0, 225);
    static color_custom_orange: cc.Color = cc.color(255,165,0);
    static color_custom_red: cc.Color = cc.color(255, 85, 85);

    static petInfos: PetInfo[] = [];
    static propInfos: PropInfo[] = [];
    static equipmentInfos: EquipmentInfo[] = [];

    onLoad() {
        cc.loader.loadResDir("", (completeCount, totalCount) => {
            let rate = Math.floor(completeCount / totalCount * 80);
            Camper.getInstance().showLoading("资源加载中(" + rate + "%)")
        }, () => {
            ResourceMgr.petInfos = cc.loader.getRes("Config/PetInfo", cc.JsonAsset).json;
            ResourceMgr.propInfos = cc.loader.getRes("Config/PropInfo", cc.JsonAsset).json;
            ResourceMgr.equipmentInfos = cc.loader.getRes("Config/EquipmentInfo", cc.JsonAsset).json;

            GlobalData.player.call("UserEquipmentController.getUserEquipments", [], (res) => {
                GlobalData.setUserEquipmentInfos(res);
                this.dataLoading();
            });
            GlobalData.player.call("UserPetController.getUserPets", [], (res) => {
                if (res.code == 200) {
                    GlobalData.setUserPetInfos(res.data);
                    this.dataLoading();
                } 
            });
            GlobalData.player.call("UserEmbattleController.getEmbattle", [], (res) => {
                GlobalData.setEmbattleInfos(res);
                this.dataLoading();
            });
            GlobalData.player.call("UserPropController.getProps", [], (res) => {
                GlobalData.setUserPropInfos(res);
                this.dataLoading();
            });
        });
    }

    private dataComplete = 0;
    private dataTotal = 4;

    dataLoading() {
        this.dataComplete++;
        let rate = 80 + Math.floor(this.dataComplete / this.dataTotal * 20);
        Camper.getInstance().showLoading("数据加载中(" + rate + "%)");
        if (this.dataComplete == this.dataTotal) {
            cc.director.preloadScene("Game", (completeCount, totalCount) => {
                Camper.getInstance().showLoading("场景加载中(" + Math.floor((completeCount / totalCount) * 100) +"%)");
            }, () => {
                cc.director.loadScene("Game");
            });
        }
    }

    static getPetInfo(petId: number) {
        for (let petInfo of this.petInfos) {
            if (petInfo.id == petId) {
                return JSON.parse(JSON.stringify(petInfo));
            }
        }
    }

    static getPropInfo(propId: number) {
        for (let propInfo of this.propInfos) {
            if (propInfo.id == propId) {
                return JSON.parse(JSON.stringify(propInfo));
            }
        }
    }

    static getEquipmentInfo(equipmentId: number) {
        for (let equipmentInfo of this.equipmentInfos) {
            if (equipmentInfo.id == equipmentId) {
                return JSON.parse(JSON.stringify(equipmentInfo));
            }
        }
    }

    public static getColorByRarity(rarity: string) {
        if (rarity == "R") {
            return this.color_custom_bule;
        } else if (rarity == "SR") {
            return this.color_custom_pruple;
        } else if (rarity == "SSR") {
            return this.color_custom_orange;
        } else if (rarity == "SP") {
            return this.color_custom_red;
        }
    }

    public static getFrameAndBase(rarity: string): cc.SpriteFrame[] {
        let frameUrl = "Texture/Icon/FrameAndBase/Frame";
        let baseUrl = "Texture/Icon/FrameAndBase/Base";
        if (rarity == "R") {
            frameUrl += 2;
            baseUrl += 2;
        } else if (rarity == "SR") {
            frameUrl += 3;
            baseUrl += 3;
        } else if (rarity == "SSR") {
            frameUrl += 4;
            baseUrl += 4;
        } else if (rarity == "SP") {
            frameUrl += 5;
            baseUrl += 5;
        } else {
            frameUrl += 1;
            baseUrl += 1;
        }
        return [
            cc.loader.getRes(frameUrl, cc.SpriteFrame),
            cc.loader.getRes(baseUrl, cc.SpriteFrame)
        ];
    }

    public static getRarity(rarity: string): cc.SpriteFrame {
        return cc.loader.getRes("Texture/Icon/Rarity/" + rarity, cc.SpriteFrame);
    }

    public static getPetAvatar(petId: number): cc.SpriteFrame {
        return cc.loader.getRes("Texture/Icon/PetHeadPhoto/" + petId, cc.SpriteFrame);
    }

    public static getPropAvatar(propId: number): cc.SpriteFrame {
        return cc.loader.getRes("Texture/Icon/Prop/" + propId, cc.SpriteFrame);
    }

    public static getEquipmentAvatar(equipmentId: number): cc.SpriteFrame {
        return cc.loader.getRes("Texture/Icon/Equipment/" + equipmentId, cc.SpriteFrame);
    }

    public static getCommon(name: string): cc.SpriteFrame {
        return cc.loader.getRes("Texture/Common/" + name.substring(0, 1).toUpperCase() + name.substring(1), cc.SpriteFrame);
    }

    public static getPetUrl(petId: number): string {
        return "DragonBone/Pet/P" + petId;
    }

    static getSegmentByIntegral(integral: number) {
        if (integral < 1200) {
            return "倔强青铜";
        } else if (integral < 1400) {
            return "秩序白银";
        } else if (integral < 1600) {
            return "荣耀黄金";
        } else if (integral < 1800) {
            return "永恒钻石";
        } else if (integral < 2000) {
            return "至尊星耀";
        } else {
            return "最强王者";
        }
    }

    static setSpriteFrame(sprite: cc.Sprite, url: string) {
        if (url.startsWith("http")) {
            cc.loader.load(url, (err, texture) => {
                if (!err) {
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                }
            })
        } else {
            sprite.spriteFrame = cc.loader.getRes(url, cc.SpriteFrame);
        }
    }
}
