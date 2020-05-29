export class JCEngine {
    public static entityClass: new() => JCEntity;

    public static boot(url: string, entityClass: new() => JCEntity) {
        JCEngine.entityClass = entityClass;
        WebSocketServer.run(url);
    }
}

export class JCEntity {
    public id: number;
    public channel: JCChannel;
    public isValid: boolean;

    public onLoad() {}

    public onDestroy() {}

    public call(func: string, args?: any[], callback?: Function) {
        if (this.isValid) {
            let uuid = "";
            let type = JCDataType.FUNCTION;
            if (func.indexOf(".") > -1) {
                uuid = JCUtil.uuid();
                type = JCDataType.METHOD;
                if (!callback) {
                    callback = arguments[arguments.length - 1];
                }
                CallbackManager.addCallback(uuid, callback);
            }
            if (args == undefined) {
                args = [];
            }
            let data = {uuid: uuid, type: type, func: func, args: args};
            this.channel.writeAndFlush(JSON.stringify(data));
        }
    }
}

class JCChannel {
    private webSocket: WebSocket;

    constructor(webSocket: WebSocket) {
        this.webSocket = webSocket;
    }

    public writeAndFlush(text: string) {
        this.webSocket.send(text);
    }

    public close() {
        this.webSocket.close();
    }
}

class WebSocketServer {
    private static webSocket: WebSocket;
    private static tempEntity: JCEntity;

    public static run(url: string) {
        if (this.webSocket && this.webSocket.OPEN) {
            this.webSocket.close();
        }
        this.webSocket = new WebSocket(url);

        this.webSocket.onopen = () => {
            this.call("loadTempEntity");
        }

        this.webSocket.onclose = () => {
            this.destroyTempEntity();
        }

        this.webSocket.onmessage = (event: MessageEvent) => {
            this.invoke(JSON.parse(event.data));            
        }
    }

    private static call(func: string, args?: any[]) {
        if (args == undefined) {
            args = [];
        }
        let data:JCData = {uuid: "", type: JCDataType.EVENT, func: func, args: args};
        this.webSocket.send(JSON.stringify(data));
    }

    private static invoke(data: JCData) {
        if (data.type == JCDataType.EVENT) {
            this[data.func].apply(this, data.args);
            return;
        }
        if (data.type == JCDataType.FUNCTION) {
            if (this.tempEntity.isValid) {
                this.tempEntity[data.func].apply(this.tempEntity, data.args); 
            }
            return;
        }
        if (data.type == JCDataType.METHOD) {
            CallbackManager.handleCallback(data);
        }
    }

    public static loadTempEntity(id: number) {
        this.tempEntity = new JCEngine.entityClass();
        this.tempEntity.id = id;
        this.tempEntity.channel = new JCChannel(this.webSocket);
        this.tempEntity.isValid = true;
        this.tempEntity.onLoad();
    }

    public static destroyTempEntity() {
        this.tempEntity.isValid = false;
        this.tempEntity.onDestroy(); 
    }
}

class CallbackManager {
    private static mapper: Map<string, CallbackInfo> = new Map();

    public static addCallback(uuid: string, callback: Function) {
        if (callback instanceof Function) {
            this.mapper.set(uuid, {
                method: callback, 
                deadTime: Date.now() + 10 * 1000
            });            
        }
    }

    public static handleCallback(data: JCData) {
        if (this.mapper.size > 10) {
            let now = Date.now();
            for (let item of this.mapper) {
                if (now >= item[1].deadTime) {
                    this.mapper.delete(item[0]);
                }
            }
        }
        let callbackInfo = this.mapper.get(data.uuid);
        if (!callbackInfo) {
            return;
        }
        if (callbackInfo.method instanceof Function) {
            this.mapper.delete(data.uuid);
            callbackInfo.method(data.args[0]);
        }
    }
} 

class JCUtil {
    
    public static uuid(): string {
        let arr = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            arr[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        arr[14] = "4";
        arr[19] = hexDigits.substr((arr[19] & 0x3) | 0x8, 1);
        arr[8] = arr[13] = arr[18] = arr[23] = "";
        return arr.join("");
    }
}

interface CallbackInfo {
    method: Function;
    deadTime: number;
}

interface JCData {
    uuid: string;
    type: number;
    func: string;
    args: any[];
}

enum JCDataType {
    EVENT,
    FUNCTION,
    METHOD
}