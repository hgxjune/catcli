import { PROTO_base } from "./PROTO_base";
import socket from "./Socket";

export class PROTO_main extends PROTO_base{

    private static instance: PROTO_main;
    public static getInstance(): PROTO_main {
        if (!PROTO_main.instance) {
            PROTO_main.instance = new PROTO_main();
        }
        return PROTO_main.instance;
    }

    constructor() {
        super();
    }

    protected regListener() {
        socket.on("startHeart", this, this.onStartHeart);
        socket.on("Heart", this, this.onHeart);
    }

    private onStartHeart(tickcount: number) {
        Laya.timer.loop(1000, this, this.doHeart);
    }

    private onHeart(bin: any) {
        ;
    }


    // heart 心跳
    private heart: proto.Heart;
    private doHeart() {
        this.send("main", "Heart", proto.Heart.encode(this.heart).finish());
        if (this.heart.tickcount > 9999) {
            this.heart.tickcount = 0;
        }
        this.heart.tickcount++;
    }
}