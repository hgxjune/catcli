import global from "../data/global";
import socket from "./Socket";
import { PROTO_base } from "./PROTO_base";

export class PROTO_login extends PROTO_base{

    private static instance: PROTO_login;
    public static getInstance(): PROTO_login {
        if (!PROTO_login.instance) {
            PROTO_login.instance = new PROTO_login();
        }
        return PROTO_login.instance;
    }

    constructor() {
        super();
    }

    protected regListener() {
        socket.on("SC_server_info", this, this.SC_server_info);
        socket.on("SC_user",        this, this.SC_user);
        socket.on("SC_login",       this, this.SC_login);
    }

    private SC_server_info(bin: any) {
        let buffer = new Uint8Array(bin);
        let data = proto.SC_server_info.decode(buffer);
        
        console.log("-- SC_server_info: ", data);
        global.server.id = data.server;
        global.server.state = data.status;
        global.server.open_date = data.open_date;
    }

    private SC_user(bin: any) {
        let buffer = new Uint8Array(bin);
        let data = proto.SC_user.decode(buffer);
        console.log("-- SC_user: ", data);
    }

    private SC_login(bin: any) {
        let buffer = new Uint8Array(bin);
        let data = proto.SC_login.decode(buffer);
        console.log("-- SC_login: ", data);
    }
}