import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";
import FrameAction from "../SDK/FrameAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6004 extends Pet {
    
    onAnimateComplete() {
        if (this.isAttack()) {
            this.playStand();
            return;
        }
        if (this.isSkill()) {
            this.playStand();
            return;
        }
        if (this.isHurt()) {
            if (this.dead) {
                this.playDead();
            } else {
                this.playStand();
            }
            return;
        }
        if (this.isDead()) {
            this.fadeOut();   
            return;
        }
    }

    onAnimateFrameEvent(frameIndex: number) {
        if (this.isAttack()) {
            this.addAttackEffect(0.6, 1);
            return;    
        } 
        if (this.isSkill()) {
            if (frameIndex == 6) {
                this.addAttackStorage();
            } else {
                this.addAttackEffect(1, 3);
            }
            return;    
        }
    }

    attack() {
        this.targets = this.getOtherOneTargets();
        if (this.hasTargets()) {
            this.playAttack();
        }
    }

    skill() {
        this.targets = this.getOtherOneTargets();
        if (this.hasTargets()) {
            this.playSkill();
        }
    }

    addAttackStorage() {
        let node = this.createSkillNode();
        node.setPosition(this.node.position.add(cc.v2(this.direction * 15, 55)));
        node.zIndex = this.node.zIndex;
        this.node.parent.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.animate("storage", 1);
    }

    addAttackEffect(scale: number, hurtScale: number) {
        let node = this.createSkillNode();
        node.setScale(scale);
        node.setPosition(this.node.position.add(cc.v2(this.direction * 30, 50)));
        this.node.parent.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        (skill as any).update = () => {
            node.zIndex = cc.winSize.height - node.y;
        };
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            this.targets[0].hurt(this, new HurtInfo(
                Math.floor(this.state_attack), 
                this.state_critRate, 
                this.state_critHurt, 
                100  * hurtScale
            ));
            this.targets[0].addDebuff(Buff.type_burn, 3, Math.floor(this.state_attack * 10 / 100), 10 * hurtScale + this.state_hit);
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.playAnimation("track", 0);

        FrameAction.tween(node)
            .moveTo(15, 
                this.targets[0].node.position.add(cc.v2(0, 50))
            )
            .callFunc(() => {
                skill.animate("explode", 1);
            })
            .start();
        let vec = this.targets[0].node.position.sub(this.node.position);
        node.angle = Math.asin(vec.y / vec.mag()) * 180 / Math.PI;
        if (vec.x < 0) {
            node.angle = 180 - node.angle;
        }
    }
}
