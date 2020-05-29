import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6133 extends Pet {

    handleRoundEnd() {
        super.handleRoundEnd();
        if (this.random(100) < 50) {
            this.addBuff(Buff.type_hurt_absorpt, 1, Math.floor(this.status_hp * 6 / 100));
        }
    }
    
    onAnimateComplete() {
        if (this.isAttack()) {
            this.moveBack();
            return;
        }
        if (this.isSkill()) {
            this.moveBack();
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
            this.targets.forEach((target: Pet) => {
                target.hurt(this, new HurtInfo(
                    this.state_attack, 
                    this.state_critRate, 
                    this.state_critHurt, 
                    60
                ));
                target.addDebuff(Buff.type_frozen, 1, 0, 5 + this.state_hit);
                this.addSkillEffect(target.node.position, target.node.zIndex, target.node.parent);
            });
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
            return;    
        } 
        if (this.isSkill()) {
            this.targets.forEach((target: Pet) => {
                target.hurt(this, new HurtInfo(
                    this.state_attack, 
                    this.state_critRate, 
                    this.state_critHurt, 
                    30
                ));
                target.addDebuff(Buff.type_frozen, 1, 0, 5 + this.state_hit);
                this.addSkillEffect(target.node.position, target.node.zIndex, target.node.parent);
            });
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
            return;    
        }
    }

    attack() {
        this.targets = this.getOtherOneRowTargets();
        if (this.hasTargets()) {
            this.moveToTarget(() => {
                this.playAttack();
            });
        }
    }

    skill() {
        this.targets = this.getOtherOneRowTargets();
        if (this.hasTargets()) {
            this.walk_superSkill = true;
            this.moveToTarget(this.playSkill.bind(this));
        }
    }

    addSkillEffect(position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_skill + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['S' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.animate("hit", 1);
    }
}

