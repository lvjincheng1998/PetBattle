const {ccclass, property} = cc._decorator;

@ccclass
export default class DragonBone extends dragonBones.ArmatureDisplay {
    private static frameRate: number = 30;
    private static dragonBoneSet: DragonBone[] = []; 
    private static dragonBonePlayingSet: DragonBone[] = [];

    public static setFrameRate(frameRate: number) {
        this.frameRate = frameRate;
        this.dragonBoneSet.forEach((dragonBone: DragonBone) => {
            dragonBone.timeScale = this.frameRate == 30 ? 1 : (this.frameRate == 60 ? 2 : 0);
        });
    }

    public static update() {
        for (let i = this.dragonBoneSet.length - 1; i >= 0; i--) {
            if (!this.dragonBoneSet[i].isValid) {
                this.dragonBoneSet.splice(i, 1);
            } 
        }
        for (let i = this.dragonBonePlayingSet.length - 1; i >= 0; i--) {
            if (!this.dragonBonePlayingSet[i].isValid) {
                this.dragonBonePlayingSet.splice(i, 1);
            } 
        }
        for (let i = this.dragonBonePlayingSet.length - 1; i >= 0; i--) {
            this.dragonBonePlayingSet[i].updateFrame();
        }
    }

    private animationInfo: any;
    private currentAnimationInfo: any;
    private currentFrameIndex: number;
    private completeListener: Function;
    private frameEventListener: Function;

    init(url: string): DragonBone {
        let urls = url.split('/');
        let name = urls[urls.length - 1];
        this.dragonAsset = cc.loader.getRes(url + '/' + name + "_ske", dragonBones.DragonBonesAsset);
        this.dragonAtlasAsset = cc.loader.getRes(url + '/' + name + "_tex", dragonBones.DragonBonesAtlasAsset);
        this.armatureName = "Armature";
        this.timeScale = DragonBone.frameRate == 30 ? 1 : (DragonBone.frameRate == 60 ? 2 : 0);
        DragonBone.dragonBoneSet.push(this);
        return this;
    }

    config(animationInfo: any) {
        this.animationInfo = JSON.parse(JSON.stringify(animationInfo));
    }

    setCompleteListener(callback: Function) {
        this.completeListener = callback;
    }

    setFrameEventListener(callback: Function) {
        this.frameEventListener = callback;
    }

    animate(animationName: string, playTimes: number) {
        let index = DragonBone.dragonBonePlayingSet.indexOf(this);
        this.currentAnimationInfo = this.animationInfo[animationName];
        this.currentFrameIndex = -1;
        this.playAnimation(animationName, playTimes);
        if (this.currentAnimationInfo) {
            if (index == -1) {
                DragonBone.dragonBonePlayingSet.push(this);
            }
            this.updateFrame();
        } else {
            if (index > -1) {
                DragonBone.dragonBonePlayingSet.splice(index, 1);
            }
        }
    }

    private updateFrame() {
        if (this.animationInfo.frameRate == 30) {
            this.updateOnce();
            return;
        }
        if (this.animationInfo.frameRate == 60) {
            if (this.updateOnce()) {
                return;
            }
            this.updateOnce();
            return;
        }
    }

    /**
     * return whether the last frame is completed
     */
    private updateOnce(): boolean {
        this.currentFrameIndex++;
        let currentFrameIndex = this.currentFrameIndex;
        let currentAnimationInfo = this.currentAnimationInfo; 
        if (currentAnimationInfo.frameEventIndexes.indexOf(currentFrameIndex) > -1) {
            if (this.frameEventListener instanceof Function) {
                this.frameEventListener(currentFrameIndex);
            }
        }
        if (currentFrameIndex == currentAnimationInfo.totalFrame) {
            DragonBone.dragonBonePlayingSet.splice(DragonBone.dragonBonePlayingSet.indexOf(this), 1);
            if (this.completeListener instanceof Function) {
                this.completeListener();
            }
            return true;
        }
        return false;
    }
}
