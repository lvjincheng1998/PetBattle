import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";
import FrameAction from "../SDK/FrameAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6006 extends Pet {
    
    onAnimateComplete() {
        if (this.isAttack()) {
            this.playStand();
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
            this.addAttackEffect();
            return;    
        } 
        if (this.isSkill()) {
            this.addSkillEffect();
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
            this.walk_superSkill = true;
            this.moveToTarget(this.playSkill.bind(this));
        }
    }

    addAttackEffect() {
        let node = this.createSkillNode();
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
                110
            ));
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.playAnimation("track", 1);

        FrameAction.tween(node)
            .moveTo(15, 
                this.targets[0].node.position.add(cc.v2(0, 50))
            )
            .callFunc(() => {
                node.angle = 0;
                node.y -= 30;
                skill.animate("hit", 1);
            })
            .start();
        let vec = this.targets[0].node.position.sub(this.node.position);
        node.angle = Math.asin(vec.y / vec.mag()) * 180 / Math.PI;
        if (vec.x < 0) {
            node.angle = 180 - node.angle;
        }
    }

    addSkillEffect() {
        let node = this.createSkillNode();
        node.zIndex = this.targets[0].node.zIndex;
        node.setPosition(this.targets[0].node.position);
        this.node.parent.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_skill + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['S' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            this.targets[0].hurt(this, new HurtInfo(
                Math.floor(this.state_attack), 
                this.state_critRate, 
                this.state_critHurt, 
                64
            ));
            this.targets[0].addDebuff(Buff.type_burn, 3, Math.floor(this.state_attack * 15 / 100), 15 + this.state_hit);
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("hit", 1);
    }
}
