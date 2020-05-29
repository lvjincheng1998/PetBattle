import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";
import FrameAction from "../SDK/FrameAction";
import { Random } from "../SDK/Random";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6115 extends Pet {
    skill_cool_round: number = 0;

    handleRoundStart() {
        super.handleRoundStart();
        let deadPets = this.getSelfDeadTargets();
        if (this.skill_cool_round == 0 && deadPets.length > 0) {
            this.skill_cool_round = 3;
            deadPets[this.random(deadPets.length)].addBuff(
                Buff.type_revive, 1, this.calculateCureValue(this.state_hp, 20)
            );
        }
    }

    handleRoundEnd() {
        super.handleRoundEnd();
        if (this.skill_cool_round > 0) {
            this.skill_cool_round--;
        }
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
            this.addAttackEffect();
            return;    
        } 
        if (this.isSkill()) {
            this.targets.forEach((target: Pet) => {
                target.addBuff(Buff.type_cure, 1, this.calculateCureValue(this.status_hp, 12));
            });
            return;    
        }
    }

    calculateCureValue(basicValue, rateValue: number) {
        let crit = false;
        if (Random.nextInt(100) < this.state_critRate) {
            crit = true;
        }
        return Math.floor(basicValue * rateValue * (crit ? this.state_critHurt / 100 : 1) / 100);
    }

    attack() {
        this.targets = this.getOtherOneTargets();
        if (this.hasTargets()) {
            this.playAttack();
        }
    }

    skill() {
        this.targets = this.getSelfAllTargets([]);
        if (this.hasTargets()) {
            this.playSkill();
        }
    }

    addAttackEffect() {
        let node = this.createSkillNode();
        node.scaleX = this.direction;
        node.setPosition(this.node.position.add(cc.v2(this.direction * 30, 30)));
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
            let hurtResult = this.targets[0].hurt(this, new HurtInfo(
                Math.floor(this.state_attack), 
                this.state_critRate, 
                this.state_critHurt, 
                100
            ));
            this.getSelfHpLower().addBuff(Buff.type_cure, 1, this.calculateCureValue(hurtResult.realHurt, 100));
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.playAnimation("run", 0);

        FrameAction.tween(node)
            .moveTo(15, 
                this.targets[0].node.position.add(cc.v2(0, 50))
            )
            .callFunc(() => {
                skill.animate("hit", 1);
            })
            .start();
    }
}
