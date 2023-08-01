import { Global } from "./data/global";
import { Socket } from "./socket/Socket";
import { PROTO_main } from "./socket/PROTO_main";
import { PROTO_login } from "./socket/PROTO_login";

export function initSingleton() {
	Global.getInstance();
	
	Socket.getInstance();
	PROTO_main.getInstance();
	PROTO_login.getInstance();
}


