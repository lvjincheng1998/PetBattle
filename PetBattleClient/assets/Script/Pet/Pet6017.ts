import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6017 extends Pet {
    
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
            this.addAttackEffect();
            return;    
        } 
        if (this.isSkill()) {
            this.addAttackEffect();
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
        this.targets = this.getOtherAllTargets([]);
        if (this.hasTargets()) {
            this.playSkill();
        }
    }

    addAttackEffect() {
        for (let target of this.targets) {
            let node = this.createSkillNode();
            node.setPosition(target.node.position);
            this.node.parent.addChild(node);

            let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
            skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
            skill.setCompleteListener(() => {
                node.destroy();
            });
            skill.setFrameEventListener(() => {
                target.hurt(this, new HurtInfo(
                    Math.floor(this.state_attack), 
                    this.state_critRate, 
                    this.state_critHurt, 
                    100
                ));
                target.addDebuff(Buff.type_palsy, 1,  Math.floor(this.state_attack * 10 / 100), 25 + this.state_hit)
                window.audioMgr.playSound(
                    window.audioMgr.path_audio_skill, 
                    window.audioMgr.audio_Hit_ZhongJi
                );
            });
            skill.animate("hit", 1);
        }
    }
}
