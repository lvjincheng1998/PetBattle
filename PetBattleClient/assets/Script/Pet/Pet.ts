import DragonBone from "../Component/DragonBone";
import HurtInfo from "./HurtInfo";
import { Random } from "../SDK/Random";
import HurtResult from "./HurtResult";
import Buff from "./Buff";
import FrameAction from "../SDK/FrameAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pet extends cc.Component {
    static EVENT_SKILL: string = "EVENT_SKILL";
    static EVENT_ENERGY: string = "EVENT_ENERGY";
    static EVENT_HP: string = "EVENT_HP";
    static EVENT_DEAD: string = "EVENT_DEAD";
    static EVENT_BATTLE_START: string = "EVENT_BATTLE_START";
    static EVENT_ROUND_START: string = "EVENT_ROUND_START";
    static EVENT_ROUND_END: string = "EVENT_ROUND_END";

    //config
    static PET_CONFIGS: any[] = [
        //LEFT
        {x: -140, y: -20, scale: 0.7, direction: 1},
        {x: -300, y: -20, scale: 0.7, direction: 1},
        {x: -170, y: -120, scale: 0.7, direction: 1},
        {x: -330, y: -120, scale: 0.7, direction: 1},
        {x: -200, y: -220, scale: 0.7, direction: 1},
        {x: -360, y: -220, scale: 0.7, direction: 1},
        //RIGHT
        {x: 140, y: -20, scale: 0.7, direction: -1},
        {x: 300, y: -20, scale: 0.7, direction: -1},
        {x: 170, y: -120, scale: 0.7, direction: -1},
        {x: 330, y: -120, scale: 0.7, direction: -1},
        {x: 200, y: -220, scale: 0.7, direction: -1},
        {x: 360, y: -220, scale: 0.7, direction: -1}
    ];

    //path
    path_dragonBone_pet: string = "DragonBone/Pet/P"
    path_dragonBone_attack: string = "DragonBone/Skill/A";
    path_dragonBone_skill: string = "DragonBone/Skill/S";

    //animate
    animate_stand: string = "stand";
    animate_walk: string = "walk";
    animate_attack: string = "attack";
    animate_skill: string = "skill";
    animate_hurt: string = "hurt";
    animate_dead: string = "dead";
    animate_win: string = "win";

    //status (static)
    status_hp: number;
    status_attack: number;
    status_defend: number;
    status_critRate: number;
    status_critHurt: number
    status_speed: number;
    status_hit: number;
    status_resist: number;

    //states (dynamic)
    state_hp: number;
    state_attack: number;
    state_defend: number;
    state_critRate: number;
    state_critHurt: number
    state_speed: number;
    state_hit: number;
    state_resist: number;
    state_energy: number = 3;

    //property
    id: number;
    index: number;
    origin: cc.Vec2;
    scale: number;
    direction: number;

    //ui flag
    statusBar_show: boolean = false;
    animate_timeScale_record: number = 1;
    //pet flag
    targets: Pet[] = [];
    doing: boolean = false;
    skilling: boolean = false;
    superSkilling: boolean = false;
    dead: boolean = false;
    rounding: boolean = false;
    walk_superSkill: boolean = false;

    //component
    dragonBone: DragonBone;
    statusBar: cc.Node;
    hpBarSprite: cc.Sprite;
    energyBarSprite: cc.Sprite;
    skillNodes: cc.Node[] = [];

    //track
    track_position: number = 0;
    track_end_need_time: number = 0;

    onLoad() {
        this.enter();
        this.addStatusBar();
        this.node.on(Pet.EVENT_SKILL, this.handleSkill, this);
        this.node.on(Pet.EVENT_ENERGY, this.handleEnergy, this);
        this.node.on(Pet.EVENT_HP, this.handleHp, this);
        this.node.on(Pet.EVENT_DEAD, this.handleDead, this);
        this.node.on(Pet.EVENT_BATTLE_START, this.handleBattleStart, this);
        this.node.on(Pet.EVENT_ROUND_START, this.handleRoundStart, this);
        this.node.on(Pet.EVENT_ROUND_END, this.handleRoundEnd, this);
    }

    update() {
        this.updateZIndex();
        this.updateStatusBar();
    }

    updatePet() {
        if (!this.isSkill()) {
            this.superSkilling = false;
        }
        for (let i = this.skillNodes.length - 1; i >= 0; i--) {
            if (!this.skillNodes[i].isValid || !this.skillNodes[i].parent) {
                this.skillNodes.splice(i, 1);
            }
        }
        if (this.skillNodes.length == 0) {
            this.skilling = false;
        }
        if (this.walk_superSkill) {
            this.superSkilling = true;
        }
        this.checkRoundEnd();
    }

    random(range: number) {
        return Random.nextInt(range);
    }

    init(id: number, index: number, status: PetStatus): Pet {
        //init status
        this.status_hp = status.hp;
        this.status_attack = status.attack;
        this.status_defend = status.defend;
        this.status_critRate = status.critRate;
        this.status_critHurt = status.critHurt;
        this.status_speed = status.speed;
        this.status_hit = status.hit;
        this.status_resist = status.resist;
        //init states
        this.state_hp = status.hp;
        this.state_attack = status.attack;
        this.state_defend = status.defend;
        this.state_critRate = status.critRate;
        this.state_critHurt = status.critHurt;
        this.state_speed = status.speed;
        this.state_hit = status.hit;
        this.state_resist = status.resist;

        //init property
        this.id = id;
        this.index = index;
        this.origin = cc.v2(Pet.PET_CONFIGS[index].x, Pet.PET_CONFIGS[index].y);
        this.scale = Pet.PET_CONFIGS[index].scale;
        this.direction = Pet.PET_CONFIGS[index].direction;
        //assign property
        this.node.setPosition(this.origin);
        this.node.opacity = 0;
        this.node.scale = this.scale;
        this.node.scaleX = this.direction * this.scale;

        //add dragonbone component
        this.dragonBone = this.node.addComponent(DragonBone).init(this.path_dragonBone_pet + id);
        this.dragonBone.config(window.battleMgr.petAnimationInfos['P' + this.id]);
        //add dragonbone listener
        this.dragonBone.setCompleteListener(this.onAnimateComplete.bind(this));
        this.dragonBone.setFrameEventListener(this.onAnimateFrameEvent.bind(this));

        return this;
    }

    createSkillNode(): cc.Node {
        let node = new cc.Node();
        this.skilling = true;
        this.skillNodes.push(node);
        return node;
    }

    updateZIndex() {
        this.node.zIndex = cc.winSize.height / 2 - this.node.y;
    }

    isLeft(): boolean {
        return this.index < 6;
    }

    isRight(): boolean {
        return this.index > 5;
    }

    isFront(): boolean {
        return this.index % 2 == 0;
    }

    isBack(): boolean {
        return this.index % 2 == 1;
    }

    hasTargets() :boolean {
        return this.targets.length > 0;
    }

    getOtherFrontColumnCenterPostion(): cc.Vec2 {
        let x = 0;
        let y = 0;
        if (this.isLeft()) {
            for (let i = 6; i < 12;  i += 2) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }
        } else if (this.isRight()) {
            for (let i = 0; i < 6; i += 2) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }
        }
        return cc.v2(x / 3, y / 3);
    }

    getOtherBackColumnCenterPostion(): cc.Vec2 {
        let x = 0;
        let y = 0;
        if (this.isLeft()) {
            for (let i = 7; i < 12;  i += 2) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }
        } else if (this.isRight()) {
            for (let i = 1; i < 6; i += 2) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }
        }
        return cc.v2(x / 3, y / 3);
    }

    getOtherSideCenterPostion(): cc.Vec2 {
        let x = 0;
        let y = 0;
        if (this.isLeft()) {
            for (let i = 6; i < 12; i++) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }   
        } else if (this.isRight()) {
            for (let i = 0; i < 6; i++) {
                x += Pet.PET_CONFIGS[i].x;
                y += Pet.PET_CONFIGS[i].y;
            }
        }
        return cc.v2(x / 6, y / 6);
    }

    getOtherOneTargets(): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 6;
            endIndex = 12;
        } else if (this.isRight()) {
            startIndex = 0;
            endIndex = 6;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i += 2) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead) {
                targets.push(pet);
            }
        }
        if (targets.length == 0) {
            for (let i = startIndex + 1; i < endIndex; i += 2) {
                let pet = window.battleMgr.pets[i];
                if (pet && !pet.dead) {
                    targets.push(pet);
                }
            }
        }
        if (targets.length == 0) {
            return targets;
        } else {
            return [targets[this.random(targets.length)]];
        }
    }

    getSelfAllTargets(ignores: Pet[]): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 0;
            endIndex = 6;
        } else if (this.isRight()) {
            startIndex = 6;
            endIndex = 12;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i++) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead && ignores.indexOf(pet) == -1) {
                targets.push(pet);
            }
        }
        return targets;
    }

    getOtherAllTargets(ignores: Pet[]): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 6;
            endIndex = 12;
        } else if (this.isRight()) {
            startIndex = 0;
            endIndex = 6;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i++) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead && ignores.indexOf(pet) == -1) {
                targets.push(pet);
            }
        }
        return targets;
    }

    getOtherOneRowTargets(): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 6;
            endIndex = 12;
        } else if (this.isRight()) {
            startIndex = 0;
            endIndex = 6;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i += 2) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead) {
                targets.push(pet);
                let nextPet = window.battleMgr.pets[i + 1];
                if (nextPet && !nextPet.dead) {
                    targets.push(nextPet);
                }
                break;
            }
        }
        if (targets.length == 0) {
            for (let i = startIndex + 1; i < endIndex; i += 2) {
                let pet = window.battleMgr.pets[i];
                if (pet && !pet.dead) {
                    targets.push(pet);
                    break;
                }
            }
        }
        return targets;
    }

    getOtherOneColumnTargets(): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 6;
            endIndex = 12;
        } else if (this.isRight()) {
            startIndex = 0;
            endIndex = 6;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i += 2) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead) {
                targets.push(pet);
            }
        }
        if (targets.length > 0) {
            return targets;
        }
        for (let i = startIndex + 1; i < endIndex; i += 2) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead) {
                targets.push(pet);
            }
        }
        return targets;
    }

    getSelfDeadTargets(): Pet[] {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 0;
            endIndex = 6;
        } else if (this.isRight()) {
            startIndex = 6;
            endIndex = 12;
        }
        let targets: Pet[] = [];
        for (let i = startIndex; i < endIndex; i++) {
            let pet = window.battleMgr.pets[i];
            if (pet && pet.dead) {
                targets.push(pet);
            }
        }
        return targets;
    }

    getSelfHpLower(): Pet {
        let startIndex: number;
        let endIndex: number;
        if (this.isLeft()) {
            startIndex = 0;
            endIndex = 6;
        } else if (this.isRight()) {
            startIndex = 6;
            endIndex = 12;
        }
        let targets = [];
        for (let i = startIndex; i < endIndex; i++) {
            let pet = window.battleMgr.pets[i];
            if (pet && !pet.dead) {
                targets.push(pet);
            }
        }
        targets.sort((a: Pet, b: Pet) => {
            return a.state_hp - b.state_hp;
        });
        return targets[0];
    }

    updateStatusBar() {
        if (this.statusBar_show) {
            if (this.statusBar.opacity < 255) {
                this.statusBar.opacity += 25.5;
            }
        } else {
            if (this.statusBar.opacity > 0) {
                this.statusBar.opacity -= 25.5;
            }
        }
        this.statusBar.setPosition(this.node.x, this.node.y + 160);
        this.statusBar.zIndex = this.node.zIndex + 1;
    }

    addStatusBar(): void {
        let statusBar = new cc.Node();
        statusBar.opacity = 0;
        this.node.parent.addChild(statusBar);
        statusBar.addComponent(cc.Sprite).spriteFrame 
            = cc.loader.getRes("Texture/Battle/PetStatusBar", cc.SpriteFrame);

        let hpBar = new cc.Node();
        hpBar.y = 3.55;
        statusBar.addChild(hpBar);
        let hpBarSprite = hpBar.addComponent(cc.Sprite);
        hpBarSprite.spriteFrame = cc.loader.getRes("Texture/Battle/PetHpBar", cc.SpriteFrame);
        hpBarSprite.type = cc.Sprite.Type.FILLED;
        hpBarSprite.fillRange = this.state_hp / this.status_hp;

        let energyBar = new cc.Node();
        energyBar.y = -2;
        statusBar.addChild(energyBar);
        let energyBarSprite = energyBar.addComponent(cc.Sprite);
        energyBarSprite.spriteFrame = cc.loader.getRes("Texture/Battle/PetEnergyBar", cc.SpriteFrame);
        energyBarSprite.type = cc.Sprite.Type.FILLED;
        energyBarSprite.fillRange = this.state_energy / 4;
        
        this.statusBar = statusBar;
        this.hpBarSprite = hpBarSprite;
        this.energyBarSprite = energyBarSprite;
    }

    showStatusBar() {
        this.statusBar_show = true;
    }

    hideStatusBar() {
        this.statusBar_show = false;
    }

    isFullEnergy() {
        return this.state_energy == 4;
    }

    addEnergy(energy: number) {
        let old_energy = this.state_energy;
        this.state_energy += energy;
        if (this.state_energy > 4) {
            this.state_energy = 4;
        }
        let variety = this.state_energy - old_energy;
        if (variety != 0) {
            this.node.emit(Pet.EVENT_ENERGY);
        }
        return variety;
    }

    subEnergy(energy: number) {
        let old_energy = this.state_energy;
        this.state_energy -= energy;
        if (this.state_energy < 0) {
            this.state_energy = old_energy;
        }
        let variety = old_energy - this.state_energy;
        if (variety != 0) {
            this.node.emit(Pet.EVENT_ENERGY);
        }
        return variety;
    }

    addHp(hp: number): number {
        let old_hp = this.state_hp;
        this.state_hp += hp;
        if (this.state_hp > this.status_hp) {
            this.state_hp = this.status_hp;
        } 
        if (this.state_hp > 0) {
            this.dead = false;
        }
        let variety = this.state_hp - old_hp;
        if (variety != 0) {
            this.node.emit(Pet.EVENT_HP);
        }
        return variety;
    }

    subHp(hp: number): number {
        let old_hp = this.state_hp;
        this.state_hp -= hp;
        if (this.state_hp <= 0) {
            this.state_hp = 0;
            this.dead = true;
        } 
        let variety = old_hp - this.state_hp;
        if (variety != 0) {
            this.node.emit(Pet.EVENT_HP);
            if (this.state_hp == 0) {
                this.node.emit(Pet.EVENT_DEAD);
            }
        }
        return variety;
    }

    addHurtValue(value: number) {
        let label = this.createLabel(value.toString());
        this.decorateLabel(label, "Font/Battle/Yellow");
        this.runLabel(label);
    }

    addCritValue(value: number) {
        let label = this.createLabel(value.toString());
        this.decorateLabel(label, "Font/Battle/Red");
        this.runLabel(label);
    }

    addCureValue(value: number) {
        let label = this.createLabel(value.toString());
        this.decorateLabel(label, "Font/Battle/Green");
        this.runLabel(label);
    }

    private createLabel(value: string): cc.Label {
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        label.fontSize = 32;
        label.lineHeight = 32;
        label.string = value.toString();
        return label;
    }

    private decorateLabel(label: cc.Label, fontUrl: string) {
        label.font = cc.loader.getRes(fontUrl, cc.Font);
    }

    private runLabel(label: cc.Label) {
        label.node.opacity = 0;
        label.node.zIndex = this.node.zIndex;
        label.node.setPosition(
            this.node.position.add(cc.v2(0, 100))
        );
        this.node.parent.addChild(label.node);
        label.node.runAction(cc.sequence(
            cc.spawn(
                cc.fadeIn(0.3),
                cc.moveBy(0.3, cc.v2(0, 30))
            ),
            cc.delayTime(0.3),
            cc.spawn(
                cc.fadeOut(0.3),
                cc.moveBy(0.3, cc.v2(0, 50))
            ),
            cc.callFunc(() => {
                label.node.destroy();
            })
        ));
    }

    //behavior

    enter() {
        this.playStand();
        this.doing = true;

        let ballNode = new cc.Node();
        this.node.parent.addChild(ballNode);
        ballNode.addComponent(cc.Sprite).spriteFrame
            = cc.loader.getRes("Texture/Icon/Ball/10001", cc.SpriteFrame);
        ballNode.setPosition(this.node.position.add(cc.v2(-this.direction * cc.winSize.width / 2, 120)));
        ballNode.setScale(this.direction * 0.7, 0.7);

        FrameAction.tween(ballNode)
            .moveTo(20, this.node.position)
            .callFunc(() => {
                ballNode.destroy();
                
                let node = new cc.Node();
                node.setPosition(this.node.position);
                this.node.parent.addChild(node);
                let dragonBone = node.addComponent(DragonBone).init("DragonBone/Common/Appear");
                dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    node.destroy();
                });
                dragonBone.playAnimation("run", 1);

                FrameAction.tween(this.node)
                    .fadeIn(15)
                    .callFunc(() => {
                        this.doing = false;
                        this.node.emit(Pet.EVENT_BATTLE_START);
                    })
                    .start();
            })
            .start();
    }

    fadeOut() {
        FrameAction.tween(this.node)
            .fadeOut(10)
            .callFunc(() => {
                this.doing = false;
            })
            .start();
    }

    moveToTarget(callback?: Function) {
        this.playWalk();
        FrameAction.tween(this.node)
            .moveTo(
                15, 
                this.targets[0].node.position.add(
                    cc.v2(-this.direction * 150, -1)
                )
            )
            .callFunc(() => {
                if (callback instanceof Function) {
                    callback();
                }
            })
            .start();
    }

    moveBack(callback?: Function) {
        this.node.scaleX = -this.node.scaleX;
        this.playWalk();
        FrameAction.tween(this.node)
            .moveTo(15 ,this.origin)
            .callFunc(() => {
                this.node.scaleX = -this.node.scaleX;
                this.playStand();
                if (callback instanceof Function) {
                    callback();
                }
            })
            .start();
    }

    startRound() {
        this.rounding = true;
        this.node.emit(Pet.EVENT_ROUND_START);
    }

    checkRoundEnd() {
        if (this.rounding && !(this.doing || this.skilling)) {
            this.rounding = false;
            this.node.emit(Pet.EVENT_ROUND_END);
        }
    }

    isControlled() {
        if (this.containBuff(Buff.type_silent) ||
            this.containBuff(Buff.type_frozen) ||
            this.containBuff(Buff.type_vertigo) ||
            this.containBuff(Buff.type_palsy)
        ) {
            return true;
        }
        return false;
    }

    launch() {
        this.startRound();
        if (this.isControlled()) {
            return;
        }
        this.addEnergy(1);
        if (false) {
            if (this.isFullEnergy()) {
                this.skill();
                this.node.emit(Pet.EVENT_SKILL);
            } else {
                this.attack();
            }
        } else {
            this.attack();
        }
    }

    releaseSkill(): any {
        if (this.isDead()) {
            return {pass: false, msg: "该精灵已阵亡"};
        }
        if (this.isHurt()) {
            return {pass: false, msg: "该精灵处于被击状态"};
        }
        if (this.isControlled()) {
            return {pass: false, msg: "该精灵处于被控状态"};
        }
        if (this.isFullEnergy()) {
            this.startRound();
            this.subEnergy(this.state_energy);
            this.skill();
            this.node.emit(Pet.EVENT_SKILL);
            return {pass: true, msg: "该精灵技能释放成功"};
        } 
        return {pass: false, msg: "该精灵能量不足"};
    }

    attack() {}

    skill() {}

    revive(value: number) {
        this.cure(value);
        this.playStand();
        FrameAction.tween(this.node).fadeIn(10).start();
        this.showStatusBar();
    }

    cure(value: number) {
        this.addHp(value);
        this.addCureValue(value);
    }

    injure(value: number) {
        this.playHurt();
        this.subHp(value);
        this.addHurtValue(value);
    }

    hurt(attacker: Pet, hurtInfo: HurtInfo): HurtResult {
        let hurtResult = new HurtResult();
        if (this.isDead()) {
            return hurtResult;
        }
        let hurtAbsorptBuff = this.getBuff(Buff.type_hurt_absorpt);
        if (!(hurtAbsorptBuff && hurtAbsorptBuff.value > 0)) {
            this.playHurt();
        }
        let defend = this.state_defend - hurtInfo.ignoreDefendValue;
        defend = defend > 0 ? defend : 1;
        defend = Math.floor(defend * (100 - hurtInfo.ignoreDefendRate) / 100);
        defend = defend > 0 ? defend : 1;
        let hurtValue = hurtInfo.attack - defend;
        hurtValue = hurtValue > 0 ? hurtValue : 1;
        hurtValue = Math.floor(hurtValue * hurtInfo.hurtRate / 100);
        hurtValue = hurtValue > 0 ? hurtValue : 1;
        let isCrit = this.random(100) < hurtInfo.critRate;
        if (isCrit) {
            hurtValue = Math.floor(hurtValue * hurtInfo.critHurt / 100);
            hurtValue = hurtValue > 0 ? hurtValue : 1;
        }
        if (hurtAbsorptBuff && hurtAbsorptBuff.value > 0) {
            hurtAbsorptBuff.value -= hurtValue;
            if (hurtAbsorptBuff.value <= 0) {
                this.removeBuff(Buff.type_hurt_absorpt);
            }
        } else {
            if (isCrit) {
                hurtResult.overFlowHurt = hurtValue - this.state_hp;
                hurtResult.realHurt = this.subHp(hurtValue);
                this.addCritValue(hurtValue);
            } else {
                hurtResult.overFlowHurt = hurtValue - this.state_hp;
                hurtResult.realHurt = this.subHp(hurtValue);
                this.addHurtValue(hurtValue);
            }
        }
        return hurtResult;
    }

    addDebuff(type: string, round: number, value: number, hitRate: number) {
        let realHitRate = Math.floor(hitRate * (100 - this.state_resist) / 100);
        if (this.random(100) < realHitRate) {
            this.addBuff(type, round, value);
        }
    }

    //#animate

    onAnimateComplete() {}

    onAnimateFrameEvent(frameIndex: number) {}

    setTimeScale(timeScale: number) {
        this.dragonBone.timeScale = timeScale;
    }

    stopAnimate() {
        if (this.dragonBone.timeScale != 0) {
            this.animate_timeScale_record = this.dragonBone.timeScale;
            this.dragonBone.timeScale = 0;
        }
    }

    resumeAnimate() {
        if (this.dragonBone.timeScale == 0) {
            this.dragonBone.timeScale = this.animate_timeScale_record;
        }
    }

    isStand() :boolean {
        return this.dragonBone.animationName == this.animate_stand;
    }

    isWalk() :boolean {
        return this.dragonBone.animationName == this.animate_walk;
    }

    isAttack() :boolean {
        return this.dragonBone.animationName == this.animate_attack;
    }

    isSkill() :boolean {
        return this.dragonBone.animationName == this.animate_skill;
    }

    isHurt() :boolean {
        return this.dragonBone.animationName == this.animate_hurt;
    }

    isDead() :boolean {
        return this.dragonBone.animationName == this.animate_dead;
    }

    isWin() :boolean {
        return this.dragonBone.animationName == this.animate_win;
    }

    playStand(playTimes?: number) {
        this.doing = false;
        this.dragonBone.animate(this.animate_stand, playTimes ? playTimes : 0);
    }

    playWalk(playTimes?: number) {
        this.doing = true;
        this.dragonBone.animate(this.animate_walk, playTimes ? playTimes : 0);
    }

    playAttack(playTimes?: number) {
        this.doing = true;
        this.dragonBone.animate(this.animate_attack, playTimes ? playTimes : 1);
    }

    playSkill(playTimes?: number) {
        this.doing = true;
        this.superSkilling = true;
        this.walk_superSkill = false;
        this.dragonBone.animate(this.animate_skill, playTimes ? playTimes : 1);
    }

    playHurt(playTimes?: number) {
        this.doing = true;
        this.superSkilling = false;
        this.walk_superSkill = false;
        this.dragonBone.animate(this.animate_hurt, playTimes ? playTimes : 1);
    }

    playDead(playTimes?: number) {
        this.doing = true;
        this.dragonBone.animate(this.animate_dead, playTimes ? playTimes : 1);
    }

    playWin(playTimes?: number) {
        this.doing = true;
        this.dragonBone.animate(this.animate_win, playTimes ? playTimes : 0);
    }

    //#buff

    buffList: Buff[] = [];

    containBuff(type: string): boolean {
        for (const buff of this.buffList) {
            if (buff.type == type) {
                return true;
            }
        }
        return false;
    }

    getBuff(type: string): Buff {
        for (const buff of this.buffList) {
            if (buff.type == type) {
                return buff;
            }
        }
        return null;
    }

    addBuff(type: string, round: number, value: number): Buff {
        if (this.dead) {
            return;
        }
        if (this.containBuff(type)) {
            this.removeBuff(type);
        }
        let buff: Buff = this.node.addComponent(Buff).init(type, round, value, this);
        this.buffList.push(buff);
        return buff;
    }

    removeBuff(type: string) {
        let newBuffList: Buff[] = [];
        this.buffList.forEach((buff: Buff) => {
            if (buff.type == type) {
                buff.close();
            } else {
                newBuffList.push(buff);
            }
        });
        this.buffList = newBuffList;
    }

    removeAllDebuff() {
        let newBuffList: Buff[] = [];
        this.buffList.forEach((buff: Buff) => {
            if (buff.type == Buff.type_silent ||
                buff.type == Buff.type_frozen ||
                buff.type == Buff.type_vertigo ||
                buff.type == Buff.type_palsy ||
                buff.type == Buff.type_poison ||
                buff.type == Buff.type_burn
            ) {
                buff.close();
            } else {
                newBuffList.push(buff);
            }
        });
        this.buffList = newBuffList;
    }

    removeAllBuff() {
        this.buffList.forEach((buff: Buff) => {
            buff.close();
        });
        this.buffList = [];
    }

    roundDownAllBuff() {
        for (let i = this.buffList.length - 1; i >= 0; i--) {
            this.buffList[i].roundDown();
        }
    }

    // event handler
    handleSkill() {
        window.battleMgr.skillPanel.showBodyPhoto(this);
    }

    statusBar_energy_last_animate_time: number = 0;

    handleEnergy() {
        this.showStatusBar();
        let now = Date.now();
        let dif = now - this.statusBar_energy_last_animate_time;
        let delay = 0;
        if (dif < 400) {
            delay += (400 - dif) / 1000;
        }
        this.statusBar_energy_last_animate_time = now + delay * 1000;
        cc.tween(this.energyBarSprite).delay(delay).to(0.3, {fillRange: this.state_energy / 4}).start();
    }

    handleHp() {
        this.showStatusBar();
        cc.tween(this.hpBarSprite).to(0.3, {fillRange: this.state_hp / this.status_hp}).start();
    }

    handleDead() {
        this.removeAllBuff();
        this.hideStatusBar();
    }

    handleBattleStart() {
        this.showStatusBar();
    }
    
    handleRoundStart() {}

    handleRoundEnd() {
        this.roundDownAllBuff();
    }
}
