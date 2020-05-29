import GlobalData from "../Common/GlobalData";
import DragonBone from "../Component/DragonBone";
import ResourceMgr from "../Manager/ResourceMgr";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GashaponPage extends cc.Component {
    @property({type: cc.Prefab})
    gashaponPageChild1: cc.Prefab = null;

    excuteGashapon(e: cc.Event.EventTouch, type: string) {
        GlobalData.player.call("GashaponController.excuteGashapon", [parseInt(type)], (res) => {
            console.log(res)
            if (res.code == 200) {
                GlobalData.userInfo = (res.data.userInfo as UserInfo);
                GlobalData.addUserPetInfos([(res.data.userPet) as UserPet]);
                this.addResult((res.data.userPet as UserPet).pet_id);
            } else {
                Camper.getInstance().showToast(res.msg);
            }
        });
    }

    addResult(petId: number) {
        let node = cc.instantiate(this.gashaponPageChild1);
        node.zIndex = cc.find("Canvas/TopBar").zIndex;
        node.getChildByName("BackGround").setContentSize(cc.winSize);
        cc.find("Canvas").addChild(node);
        node.getChildByName("Btn").on(cc.Node.EventType.TOUCH_END, () => {
            node.destroy();
        });
        let petInfo = ResourceMgr.getPetInfo(petId);
        node.getChildByName("Card" + petInfo.rarity).active = true;
        node.getChildByName("NickName").getChildByName("Rarity").getComponent(cc.Sprite).spriteFrame = 
            cc.loader.getRes("Texture/Icon/Rarity/" + petInfo.rarity, cc.SpriteFrame);
        node.getChildByName("NickName").getChildByName("Label").getComponent(cc.Label).string = 
            petInfo.name;
        node.getChildByName("NickName").getChildByName("Label").color = ResourceMgr.getColorByRarity(petInfo.rarity);
        node.getChildByName("PetModel").removeComponent(dragonBones.ArmatureDisplay);
        node.getChildByName("PetModel").addComponent(DragonBone).init("DragonBone/Pet/P" + petId).playAnimation("stand", 0);
    }
}
