import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6095 extends Pet {
    
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
            this.addAttackEffect(
                this.targets[0].node.position.add(cc.v2(0, 50)), 
                this.targets[0].node.zIndex, 
                this.targets[0].node.parent
            );
            return;    
        } 
        if (this.isSkill()) {
            this.addSkillEffect(
                this.targets[0].node.position.add(cc.v2(0, 50)), 
                this.targets[0].node.zIndex, 
                this.targets[0].node.parent
            );
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
            if (this.random(100) < 30) {
                this.addBuff(Buff.type_allState_up, 1, 0);
            }
        }
    }

    addAttackEffect(position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        skill.setCompleteListener(() => {
            if (skill.animationName == "down") {
                skill.animate("hit", 1);
            } else if (skill.animationName == "hit") {
                node.destroy();
            }
        });
        skill.setFrameEventListener(() => {
            let target = this.targets[0];
            target.hurt(this, new HurtInfo(
                this.state_attack, 
                this.state_critRate, 
                this.state_critHurt, 
                100
            ));
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("down", 1);
    }

    addSkillEffect(position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.scaleX = this.direction;
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let overFlowHurt: number;

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_skill + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['S' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();

            this.targets = this.getOtherAllTargets(this.targets);
            if (overFlowHurt > 0 && this.hasTargets()) {
                this.targets.forEach((target: Pet) => {
                    this.addSkillExtraEffect(target, overFlowHurt, target.node.position.add(cc.v2(0, 50)), target.node.zIndex, target.node.parent);
                });
            }
        });
        skill.setFrameEventListener(() => {
            let target = this.targets[0];
            let hurtResult = target.hurt(this, new HurtInfo(
                this.state_attack, 
                this.state_critRate, 
                this.state_critHurt, 
                263
            ));
            overFlowHurt = hurtResult.overFlowHurt;
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("hit", 1);
    }

    addSkillExtraEffect(target: Pet, extraHurt: number,position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            target.hurt(this, new HurtInfo(
                extraHurt, 
                this.state_critRate, 
                this.state_critHurt, 
                100, 0, 100
            ));
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("hit", 1);
    }
}
