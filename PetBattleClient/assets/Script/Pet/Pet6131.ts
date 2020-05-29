import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6131 extends Pet {

    handleBattleStart() {
        super.handleBattleStart();
        this.addBuff(Buff.type_defend_up, 3, Math.floor(this.status_defend * 30 / 100));
    }
    
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
                this.targets[0].isFront() ?
                    this.getOtherFrontColumnCenterPostion() : 
                    this.getOtherBackColumnCenterPostion(),
                cc.winSize.height, 
                this.node.parent
            );
            return;    
        } 
        if (this.isSkill()) {
            this.addSkillEffect(
                this.getOtherSideCenterPostion().add(cc.v2(0, 50)), 
                cc.winSize.height, 
                this.node.parent
            );
            return;    
        }
    }

    attack() {
        this.targets = this.getOtherOneColumnTargets();
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

    addAttackEffect(position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.scaleX = this.direction;
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            this.targets.forEach((target: Pet) => {
                target.hurt(this, new HurtInfo(
                    this.state_attack, 
                    this.state_critRate, 
                    this.state_critHurt, 
                    50
                ));
            });
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("hit", 1);
    }

    addSkillEffect(position: cc.Vec2, zIndex: number, parentNode: cc.Node) {
        let node = this.createSkillNode();
        node.scaleX = this.direction;
        node.zIndex = zIndex;
        node.setPosition(position);
        parentNode.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_skill + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['S' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            this.targets.forEach((target: Pet) => {
                target.hurt(this, new HurtInfo(
                    this.state_attack, 
                    this.state_critRate, 
                    this.state_critHurt, 
                    150
                ));
            });
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.animate("hit", 1);
    }
}
