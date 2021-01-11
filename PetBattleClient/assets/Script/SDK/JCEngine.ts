export class JCEngine {
    public static url: string;
    public static entityClass: new() => JCEntity;

    public static boot(url: string, entityClass: new() => JCEntity) {
        this.url = url;
        this.entityClass = entityClass;
        new JCEngineCore.WebSocketServer(url, null);
    }

    public static reBoot(entity: JCEntity) {
        new JCEngineCore.WebSocketServer(this.url, entity);
    }
}

export class JCEntity {
    public id: number;
    public channel: JCEngineCore.Channel;
    public isValid: boolean;
    public loaded: boolean;

    public onLoad() {}

    public onReload() {}

    public onDestroy() {}

    public onMiss() {}

    public call(func: string, args?: any[], callback?: Function): boolean {
        if (this.isValid) {
            let uuid = "";
            let type = JCEngineCore.DataType.FUNCTION;
            if (func.indexOf(".") > -1) {
                type = JCEngineCore.DataType.METHOD;
                if (!callback) {
                    callback = arguments[arguments.length - 1];
                }
                uuid = JCEngineCore.CallbackHandler.addCallback(callback);
            }
            if (args == undefined) {
                args = [];
            }
            let data = {uuid: uuid, type: type, func: func, args: args};
            this.channel.writeAndFlush(JSON.stringify(data));
            return true;
        }
        return false;
    }
}

module JCEngineCore {

    export class Channel {
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

    export class WebSocketServer {
        private webSocket: WebSocket;
        private tempEntity: JCEntity;
    
        constructor(url: string, entity: JCEntity) {
            this.webSocket = new WebSocket(url);
            this.tempEntity = entity ? entity : new JCEngine.entityClass();
    
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
    
        private call(func: string, args?: any[]) {
            if (args == undefined) {
                args = [];
            }
            let data: Data = {uuid: "", type: DataType.EVENT, func: func, args: args};
            this.webSocket.send(JSON.stringify(data));
        }
    
        private invoke(data: Data) {
            if (data.type == DataType.EVENT) {
                this[data.func].apply(this, data.args);
                return;
            }
            if (data.type == DataType.FUNCTION) {
                if (this.tempEntity.isValid) {
                    this.tempEntity[data.func].apply(this.tempEntity, data.args); 
                }
                return;
            }
            if (data.type == DataType.METHOD) {
                CallbackHandler.handleCallback(data);
            }
        }
    
        public loadTempEntity(id: number) {
            this.tempEntity.id = id;
            this.tempEntity.channel = new JCEngineCore.Channel(this.webSocket);
            this.tempEntity.isValid = true;
            try {
                this.tempEntity.loaded ? this.tempEntity.onReload() : this.tempEntity.onLoad();
            } catch (e) {}
            this.tempEntity.loaded = true;
        }
    
        public destroyTempEntity() {
            if (this.tempEntity.isValid) {
                this.tempEntity.isValid = false;
                this.tempEntity.onDestroy();            
            } else {
                this.tempEntity.onMiss();
            }
        }
    }

    export class CallbackHandler {
        private static nextID: number = 0;
        private static mapper: Map<string, CallbackInfo> = new Map();
    
        private static uuid(): string {
            this.nextID++;
            return this.nextID.toString();
        }
    
        public static addCallback(callback: Function): string {
            let uuid = this.uuid();
            if (callback instanceof Function) {
                this.mapper.set(uuid, {
                    callback: callback, 
                    deadTime: Date.now() + 10 * 1000
                });            
            }
            return uuid;
        }
    
        public static handleCallback(data: Data) {
            if (this.mapper.size > 10) {
                let now = Date.now();
                for (let item of (this.mapper as any)) {
                    let key = item[0].deadTime;
                    let value = item[1];
                    if (now >= value.deadTime) {
                        this.mapper.delete(key);
                    }
                }
            }
            let callbackInfo = this.mapper.get(data.uuid);
            if (callbackInfo && callbackInfo.callback instanceof Function) {
                this.mapper.delete(data.uuid);
                callbackInfo.callback(data.args[0]);
            }
        }
    } 

    export interface CallbackInfo {
        callback: Function;
        deadTime: number;
    }
    
    export interface Data {
        uuid: string;
        type: number;
        func: string;
        args: any[];
    }
    
    export enum DataType {
        EVENT,
        FUNCTION,
        METHOD
    }
}

