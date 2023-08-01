
interface User {
    uid: string;
    rid: number;
}

interface Server {
    id: number;
    name: string;
    ip: string;
    port: number;
    ws: string;
    state: number;
    open_date: string;
}

export const enum GameState {
    empty,
    online,
    offline
}

export class Global {
    private static instance: Global;

    public gameState: GameState = GameState.empty;
    public user = {} as User;
    public server = {} as Server

    public static getInstance(): Global {
        if (!Global.instance) {
            Global.instance = new Global();
        }
        return Global.instance;
    }

    constructor() {
    }

    public saveServer() {
        console.log(`-- global saveServer 1: ${Laya.LocalStorage.getJSON("server")}`);
        console.log(`-- global saveServer 2: ${this.server}`);
        Laya.LocalStorage.setJSON("server", this.server);
        console.log(`-- global saveServer 3: ${Laya.LocalStorage.getJSON("server")}`);
    }
}

const global = Global.getInstance();
export default global;
