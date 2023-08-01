import global from "../data/global";

export class Socket extends Laya.EventDispatcher {
    private static instance: Socket;
    private _socket: Laya.Socket;
    private _erpc: proto.ERPC;
    private _byte: Laya.Byte;

    constructor() {
        super();
        this.creatSocket();
    }

    public static getInstance() {
        if (!Socket.instance) {
            Socket.instance = new Socket();
        }
        return Socket.instance;
    }

    public creatSocket() {
        if (this._socket) {
            return;
        }
        this._socket = new  Laya.Socket();
        this._socket.endian = Laya.Byte.LITTLE_ENDIAN;
        this._erpc = proto.ERPC.create();
        this._byte = new Laya.Byte();
        this._byte.endian = Laya.Byte.LITTLE_ENDIAN;
    }

    public connect(): boolean {
        if ( this._socket.connected ) {
            console.log("connected!!");
            return false;
        }
        if ( !global.server.ip ) {
            console.log("ip undefind!");
            return false;
        }
        if ( global.server.ip == "" ) {
            console.log("ip null!");
            return false;
        }
        if ( !(global.server.port > 0) ) {
            console.log("port err!");
            return false;
        }
        this._socket.connect(global.server.ip, global.server.port);
        this.regHandler();
        return true;
    }

    public connectByUrl(): boolean {
        if ( this._socket.connected ) {
            console.log("connected!!");
            return false;
        }
        if ( !global.server.ws ) {
            console.log("ws address undefind!");
            return false;
        }
        if ( global.server.ws == "" ) {
            console.log("ws address null!");
            return false;
        }
        this._socket.connectByUrl(global.server.ws);
        this.regHandler();
        return true;
    }

    public close() {
        this._socket.close();
    }

    private regHandler() {
        this._socket.on(Laya.Event.OPEN,    this, this.handlerOpen);
        this._socket.on(Laya.Event.MESSAGE, this, this.handlerReceive);
        this._socket.on(Laya.Event.CLOSE,   this, this.handlerClose);
        this._socket.on(Laya.Event.ERROR,   this, this.handlerError);
    }

    private handlerOpen(event: any = null) {
        // console.log(`-- _socket handlerOpen: ${event}`);
        // 开启心跳消息
        this.event("startHeart", 0);
    }

    private handlerReceive(msg: any = null) {
        //console.log(`-- _socket handlerReceive: ${msg}`);
        this.receive(msg);
    }

    private handlerClose(e: any = null) {
        console.log(`-- _socket handlerClose: ${e}`);
    }

    private handlerError(e: any = null) {
        console.log(`-- _socket handlerError: ${e}`);
    }

    // 这里是否要 try
    public send(module: string, name: string, bin: any) {
        try {
            this._erpc.module = module;
            this._erpc.name = name;
            this._erpc.bin = bin;
            this._byte.writeArrayBuffer(proto.ERPC.encode(this._erpc).finish());
    
            this._socket.send(this._byte.buffer);
            this._byte.clear();
        } catch (error) {
            console.log(`-- _socket send error: ${error}`);
        }
    }

    private receive(bin: any) {
        try {
            let buffer = new Uint8Array(bin);
            let erpc = proto.ERPC.decode(buffer);
    
            this.event(erpc.name, erpc.bin);
        } catch (error) {
            console.log(`-- _socket receive error: ${error}`);
        }
    }
}

const socket = Socket.getInstance();
export default socket;
