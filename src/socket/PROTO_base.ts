import socket from "./Socket";


export class PROTO_base {
    constructor() {
        this.regListener();
    }

    protected regListener(): void {
        ;
    }

    protected send(module: string, name: string, bin: any): void {
        socket.send(module, name, bin);
    }
}