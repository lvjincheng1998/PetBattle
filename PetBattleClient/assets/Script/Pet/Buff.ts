import DragonBone from "../Component/DragonBone";
import Pet from "./Pet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Buff extends cc.Component {
    type: string;
    round: number;
    value: number;
    master: Pet;
    private id: number;
    private dragonBone: DragonBone;
    private animationInfo: AnimationInfo;

    private static animationInfos: any = {
        "100_super": {position: cc.v2(0, 0), scale: 1, zIndex: 1},
        "100_hp": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "100_attack": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "100_defend": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "100_speed": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "100_crit_rate": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "100_crit_hurt": {position: cc.v2(0, 90), scale: 1, zIndex: 1},
        "101_buff": {position: cc.v2(0, 80), scale: 1, zIndex: 1},
        "102_buff": {position: cc.v2(0, 0), scale: 1, zIndex: 1},
        "102_buff_start": {position: cc.v2(0, 0), scale: 1, zIndex: 1},
        "102_buff_end": {position: cc.v2(0, 0), scale: 1, zIndex: 1},
        "103_buff": {position: cc.v2(-5, 0), scale: 1, zIndex: -1},
        "103_clear": {position: cc.v2(-12, 0), scale: 1, zIndex: 1},
        "200_buff": {position: cc.v2(0, 50), scale: 1, zIndex: 1},
        "201_buff": {position: cc.v2(0, 50), scale: 1, zIndex: 1},
        "202_buff": {position: cc.v2(0, 120), scale: 0.7, zIndex: 1},
        "203_buff": {position: cc.v2(0, 50), scale: 1, zIndex: 1},
        "204_buff": {position: cc.v2(0, 50), scale: 1, zIndex: 1},
        "205_buff": {position: cc.v2(0, 50), scale: 1, zIndex: 1}
    };

    //BUFF
    static type_allState_up: string = "type_allState_up";
    static type_hp_recovery: string = "type_hp_recovery";
    static type_attack_up: string = "type_attack_up";
    static type_defend_up: string = "type_defend_up";
    static type_speed_up: string = "type_speed_up";
    static type_critRate_up: string = "type_critRate_up";
    static type_critHurt_up: string = "type_critHurt_up";
    static type_cure: string = "type_cure";
    static type_revive: string = "type_revive";
    static type_hurt_absorpt: string = "type_hurt_absorpt";
    static type_negative_immune: string = "type_negative_immune";
    static type_negative_clear: string = "type_negative_clear";
    //DEBUFF
    static type_silent: string = "type_silent";
    static type_frozen: string = "type_frozen";
    static type_vertigo: string = "type_vertigo";
    static type_palsy: string = "type_palsy";
    static type_poison: string = "type_poison";
    static type_burn: string = "type_burn";

    init(type: string, round: number, value: number | any, master: Pet): Buff {
        this.type = type;
        this.round = round;
        this.value = value;
        this.master = master;

        if (type == Buff.type_allState_up) {
            this.initDragonBoneById(100).play("super", 0);
            master.state_attack += Math.floor(master.status_attack * 10 / 100);
            master.state_defend += Math.floor(master.status_defend * 10 / 100);
            master.state_speed += 10;
            master.state_critRate += 10;
            master.state_critHurt += 20;
            master.state_resist += 20
            return this;
        }
        if (type == Buff.type_hp_recovery) {
            this.initDragonBoneById(100).play("hp", 1);
            return this;
        }
        if (type == Buff.type_attack_up) {
            this.initDragonBoneById(100).play("attack", 1);
            master.state_attack += value;
            return this;
        }
        if (type == Buff.type_defend_up) {
            this.initDragonBoneById(100).play("defend", 1);
            master.state_defend += value;
            return this;
        }
        if (type == Buff.type_speed_up) {
            this.initDragonBoneById(100).play("speed", 1);
            master.state_speed += value;
            return this;
        }
        if (type == Buff.type_critRate_up) {
            this.initDragonBoneById(100).play("crit_rate", 1);
            master.state_critRate += value;
            return this;
        }
        if (type == Buff.type_critHurt_up) {
            this.initDragonBoneById(100).play("crit_hurt", 1);
            master.state_critHurt += value;
            return this;
        }
        if (type == Buff.type_cure) {
            this.initDragonBoneById(101).play("buff", 1);
            master.cure(value);
            return this;
        }
        if (type == Buff.type_revive) {
            this.initDragonBoneById(101).play("buff", 1);
            master.revive(value);
            return this;
        }
        if (type == Buff.type_hurt_absorpt) {
            this.initDragonBoneById(102).play("buff_start", 1);
            return this;
        }
        if (type == Buff.type_negative_immune) {
            this.initDragonBoneById(103).play("buff", 0);
            return this;
        }
        if (type == Buff.type_negative_clear) {
            this.initDragonBoneById(103).play("clear", 1);
            master.removeAllDebuff();
            return this;
        }
        if (type == Buff.type_silent) {
            this.initDragonBoneById(200).play("buff", 0);
            this.node.color = cc.color(255, 100, 0);
            return this;
        }
        if (type == Buff.type_frozen) {
            this.initDragonBoneById(201).play("buff", 0);
            this.node.color = cc.color(0, 155, 255);
            return this;
        }
        if (type == Buff.type_vertigo) {
            this.initDragonBoneById(202).play("buff", 0);
            return this;
        }
        if (type == Buff.type_palsy) {
            this.initDragonBoneById(203).play("buff", 0);
            return this;
        }
        if (type == Buff.type_poison) {
            this.initDragonBoneById(204).play("buff", 0);
            this.node.color = cc.color(155, 0, 255);
            return this;
        }
        if (type == Buff.type_burn) {
            this.initDragonBoneById(205).play("buff", 0);
            this.node.color = cc.color(255, 0, 0);
            return this;
        }
    }

    private initDragonBoneById(id: number): Buff {
        this.id = id;

        //create dragonbone node
        let node = new cc.Node();
        node.opacity = 0;
        this.node.parent.addChild(node);
        //add dragonbone component
        this.dragonBone = node.addComponent(DragonBone).init("DragonBone/Buff/" + id);
        //add dragonbone  listener
        this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimateComplete, this);

        return this;
    }

    private onAnimateComplete() {
        if (this.type == Buff.type_cure) {
            this.fadeOut();
            return;
        }
        if (this.type == Buff.type_revive) {
            this.fadeOut();
            return;
        }
        if (this.type == Buff.type_hurt_absorpt) {
            if (this.isPlaying("buff_start")) {
                this.play("buff", 0);
                return;
            }
            if (this.isPlaying("buff_end")) {
                this.destroy();
                return;
            }
        }
        if (this.type == Buff.type_negative_clear) {
            this.fadeOut();
            return;
        }
    }

    roundDown() {
        if (this.round > 0) {
            this.round--;
            if (this.type == Buff.type_hp_recovery) {
                this.master.cure(this.value);
            }
            if (this.type == Buff.type_poison ||
                this.type == Buff.type_burn
            ) {
                this.master.injure(this.value);
            }
        }
        if (this.round <= 0) {
            this.master.removeBuff(this.type);
        }
    }

    close() {
        if (this.type == Buff.type_allState_up) {
            this.master.state_attack -= Math.floor(this.master.status_attack * 10 / 100);
            this.master.state_defend -= Math.floor(this.master.status_defend * 10 / 100);
            this.master.state_speed -= 10;
            this.master.state_critRate -= 10;
            this.master.state_critHurt -= 20;
            this.master.state_resist -= 20
            this.fadeOutAndDestroy();
            return;
        }
        if (this.type == Buff.type_hp_recovery) {
            this.destroy();
            return;
        }
        if (this.type == Buff.type_attack_up) {
            this.master.state_attack -= this.value;
            this.destroy();
            return this;
        }
        if (this.type == Buff.type_defend_up) {
            this.master.state_defend -= this.value;
            this.destroy();
            return this;
        }
        if (this.type == Buff.type_speed_up) {
            this.master.state_speed -= this.value;
            this.destroy();
            return this;
        }
        if (this.type == Buff.type_critRate_up) {
            this.master.state_critRate -= this.value;
            this.destroy();
            return this;
        }
        if (this.type == Buff.type_critHurt_up) {
            this.master.state_critHurt -= this.value;
            this.destroy();
            return this;
        }
        if (this.type == Buff.type_cure) {
            this.destroy();
            return;
        }
        if (this.type == Buff.type_revive) {
            this.destroy();
            return;
        }
        if (this.type == Buff.type_hurt_absorpt) {
            this.play("buff_end", 1);
            return;
        }
        if (this.type == Buff.type_negative_immune) {
            this.fadeOutAndDestroy();
            return;
        }
        if (this.type == Buff.type_negative_clear) {
            this.destroy();
            return;
        }
        if (this.type == Buff.type_silent ||
            this.type == Buff.type_frozen ||
            this.type == Buff.type_vertigo ||
            this.type == Buff.type_palsy ||
            this.type == Buff.type_poison ||
            this.type == Buff.type_burn
        ) {
            if (this.type == Buff.type_silent && this.node.color.equals(cc.color(255, 100, 0)) ||
                this.type == Buff.type_frozen && this.node.color.equals(cc.color(0, 155, 255)) ||
                this.type == Buff.type_poison && this.node.color.equals(cc.color(155, 0, 255)) ||
                this.type == Buff.type_burn && this.node.color.equals(cc.color(255, 0, 0))) {
                this.node.color = cc.Color.WHITE;
            }
            this.fadeOutAndDestroy();
            return;
        }
    }

    private fadeOut() {
        this.dragonBone.node.runAction(cc.fadeOut(0.3));
    }

    private fadeOutAndDestroy() {
        this.dragonBone.node.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(this.destroy, this)
        ));
    }

    private isPlaying(animationName: string): boolean {
        return this.dragonBone.animationName == animationName;
    }

    private play(animationName: string, playTimes: number) {
        this.dragonBone.playAnimation(animationName, playTimes);
        this.animationInfo = Buff.animationInfos[this.id + '_' + this.dragonBone.animationName];
    }

    private firstUpdate: boolean = false;

    update() {
        if (this.animationInfo) {
            if (!this.firstUpdate) {
                this.firstUpdate = true;
                this.dragonBone.node.opacity = 255;
            }
            this.dragonBone.node.setPosition(this.node.position.add(this.animationInfo.position));
            this.dragonBone.node.setScale(
                this.node.scaleX > 0 ? this.animationInfo.scale : -this.animationInfo.scale,
                this.animationInfo.scale
            );
            this.dragonBone.node.zIndex = this.node.zIndex + this.animationInfo.zIndex;
        }
    }
    
    destroy(): boolean {
        this.dragonBone.node.destroy();
        return super.destroy();
    }
}
interface AnimationInfo {
    position: cc.Vec2;
    scale: number;
    zIndex: number;
}
