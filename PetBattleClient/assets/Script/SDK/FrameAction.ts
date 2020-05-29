export default class FrameAction {
    private static frameActionList: FrameAction[] = [];

    public static tween(target: any): FrameAction {
        return new FrameAction(target);
    }

    public static update() {
        let completedFrameActionList: FrameAction[] = [];
        this.frameActionList.forEach((frameAction: FrameAction) => {
            let frameActionInfoQueue = frameAction.frameActionInfoQueue;
            if (frameActionInfoQueue.length > 0) {
                let target = frameAction.target;
                let frameActionInfo = frameActionInfoQueue[0];
                frameActionInfo.init();
                if (frameActionInfo instanceof FrameActionMoveTo && target instanceof cc.Node && target.isValid) {
                    target.setPosition(target.position.add(frameActionInfo.delta));
                } else if (frameActionInfo instanceof FrameActionFade && target instanceof cc.Node && target.isValid) {
                    target.opacity += frameActionInfo.delta;
                } else if (frameActionInfo instanceof FrameActionCallFunc) {
                    try {
                        frameActionInfo.callback();
                    } catch {}
                }
                frameActionInfo.frameCount--;
                if (frameActionInfo.frameCount <= 0) {
                    frameActionInfoQueue.shift();
                }
            }
            if (frameActionInfoQueue.length == 0) {
                completedFrameActionList.push(frameAction);
            }
        });
        let newFrameActionList: FrameAction[] = [];
        this.frameActionList.forEach((frameAction: FrameAction) => {
            if (completedFrameActionList.indexOf(frameAction) == -1) {
                newFrameActionList.push(frameAction);
            }
        });
        this.frameActionList = newFrameActionList;
    }

    private target: any;
    private frameActionInfoQueue: FrameActionInfo[] = []; 

    constructor(target: any) {
        this.target = target;
    }

    public moveTo(frameCount: number, position: cc.Vec2): FrameAction {
        this.frameActionInfoQueue.push(new FrameActionMoveTo(this.target, frameCount, position));
        return this;
    }

    public fadeIn(frameCount: number): FrameAction {
        this.frameActionInfoQueue.push(new FrameActionFade(this.target, frameCount, 255));
        return this;
    }

    public fadeOut(frameCount: number): FrameAction {
        this.frameActionInfoQueue.push(new FrameActionFade(this.target, frameCount, 0));
        return this;
    }

    public callFunc(callback: Function): FrameAction {
        this.frameActionInfoQueue.push(new FrameActionCallFunc(this.target, 0, callback));
        return this;
    }

    public start() {
        FrameAction.frameActionList.push(this);
    }
}
class FrameActionInfo {
    target: any;
    frameCount: number;
    initialized: boolean;

    constructor(target: any, frameCount: number) {
        this.target = target;
        this.frameCount = frameCount;
    }

    public init() {}
}
class FrameActionMoveTo extends FrameActionInfo {
    origin: cc.Vec2;
    position: cc.Vec2;
    delta: cc.Vec2;

    constructor(target: any, frameCount: number, position: cc.Vec2) {
        super(target, frameCount);
        this.position = position;
    }

    public init() {
        if (this.initialized) {
            return;
        } else {
            this.initialized = true;
        }
        this.origin = (this.target as cc.Node).position;
        this.delta = cc.v2(
            (this.position.x - this.origin.x) / this.frameCount, 
            (this.position.y - this.origin.y) / this.frameCount
        );
    }
}
class FrameActionFade extends FrameActionInfo {
    opacityStart: number;
    opacityEnd: number;
    delta: number;

    constructor(target: any, frameCount: number, opacityEnd: number) {
        super(target, frameCount);
        this.opacityEnd = opacityEnd;
    }

    public init() {
        if (this.initialized) {
            return;
        } else {
            this.initialized = true;
        }
        this.opacityStart = (this.target as cc.Node).opacity;
        this.delta = (this.opacityEnd - this.opacityStart) / this.frameCount;
    }
}
class FrameActionCallFunc extends FrameActionInfo {
    callback: Function;

    constructor(target: any, frameCount: number, callback: Function) {
        super(target, frameCount);
        this.callback = callback;
    }
}

