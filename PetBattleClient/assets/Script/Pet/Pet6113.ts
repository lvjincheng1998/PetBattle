import Pet from "./Pet";
import HurtInfo from "./HurtInfo";
import DragonBone from "../Component/DragonBone";
import Buff from "./Buff";
import FrameAction from "../SDK/FrameAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet6113 extends Pet {
    
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
            this.addSkillEffect();
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

    addAttackEffect() {
        let node = this.createSkillNode();
        node.scaleX = this.direction;
        node.setPosition(
            this.targets[0].isFront() ?
            this.getOtherFrontColumnCenterPostion() :
            this.getOtherBackColumnCenterPostion()
        );
        node.zIndex = cc.winSize.height / 2 - node.y;
        this.node.parent.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_attack + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['A' + this.id]);
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            this.addAttackHitEffect();
        });
        skill.animate("track", 1);
    }

    addAttackHitEffect() {
        this.targets.forEach(target => {
            let node = this.createSkillNode();
            node.setPosition(target.node.position);
            node.zIndex = target.node.zIndex;
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
                    66
                ));
            });
            skill.animate("hit", 1);
        });
        window.audioMgr.playSound(
            window.audioMgr.path_audio_skill, 
            window.audioMgr.audio_Hit_ZhongJi
        );
    }

    addSkillEffect() {
        let targets = [];
        for (let target of this.targets) {
            if (!target.dead) {
                targets.push(target);
            }
        }
        if (targets.length == 0) {
            return;
        }
        let target = targets[this.random(targets.length)];

        let node = this.createSkillNode();
        node.setPosition(this.node.position.add(cc.v2(this.direction * 30, 50)));
        this.node.parent.addChild(node);

        let skill = node.addComponent(DragonBone).init(this.path_dragonBone_skill + this.id);
        skill.config(window.battleMgr.skillAnimationInfos['S' + this.id]);
        (skill as any).update = () => {
            node.zIndex = cc.winSize.height - node.y;
        };
        skill.setCompleteListener(() => {
            node.destroy();
        });
        skill.setFrameEventListener(() => {
            target.hurt(this, new HurtInfo(
                Math.floor(this.state_attack), 
                this.state_critRate, 
                this.state_critHurt, 
                66
            ));
            window.audioMgr.playSound(
                window.audioMgr.path_audio_skill, 
                window.audioMgr.audio_Hit_ZhongJi
            );
        });
        skill.playAnimation("track", 1);

        FrameAction.tween(node)
            .moveTo(15, 
                target.node.position.add(cc.v2(0, 50))
            )
            .callFunc(() => {
                node.angle = 0;
                node.y -= 30;
                skill.animate("hit", 1);
            })
            .start();
        let vec = target.node.position.sub(this.node.position);
        node.angle = Math.asin(vec.y / vec.mag()) * 180 / Math.PI;
        if (vec.x < 0) {
            node.angle = 180 - node.angle;
        }
    }
}
