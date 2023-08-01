import BaseScene from "./BaseScene";
import global from "../data/global";
import socket from "../socket/Socket";

export default class LoginScene extends BaseScene {

    public static instance: LoginScene;

    private loginDialog: Laya.Sprite;
    private serverBox: Laya.Sprite;
    private loginInfo: Laya.Sprite;
    private btnLogin: Laya.Button;
    private inputAccount: Laya.TextInput;
    private serverGroup: Laya.List;
    private serverList: Laya.List;
    private serverInfo: Laya.Box;
    private serverName: Laya.Label;
    private serverState: Laya.Label;
    private btnConnect: Laya.Button;
    private groups = [];
    private servers = [];

    constructor() {
        super();
        LoginScene.instance = this;
    }

    createChildren() {
        super.createChildren();
        this.loadScene("Login");
    }

    onEnable() {
        this.initView();
        this.initListener();
        this.openLoginDialog();
    }

    initView() {
        Laya.Stat.show(0,0);
    }

    initListener() {
        this.btnLogin.clickHandler = new Laya.Handler(this, this.onBtnLogin, [this.btnLogin], false);
        this.btnConnect.clickHandler = new Laya.Handler(this, this.onBtnConnect, [this.btnConnect], false);
        //this.serverInfo.on(Laya.Event.CLICK, this, () => this.chooseServer());
        this.serverInfo.on(Laya.Event.CLICK, this, this.chooseServer);
    }

    ////////////////////////////////////////////////////////////////////////////
    private openLoginDialog() {
        this.loginDialog.set_visible(true);
        this.serverBox.set_visible(false);
        this.loginInfo.set_visible(false);
    }

    private onBtnLogin(button:Laya.Button) {
        if (!this.inputAccount.text) {
            console.log("请输入用户名");
            return;
        }
        this.onLogin();
    }

    // 登陆验证，成功后，登陆成功数据写入到 data 中
    private onLogin() {
        global.user.uid = this.inputAccount.text;
        this.openServerList();
    }

    ////////////////////////////////////////////////////////////////////////////
    // 登陆成功后获取服务器列表
    private openServerList() {
        let handlerLoaded = Laya.Handler.create(this, this.openServerListLoaded);
        Laya.loader.load("../server.json", handlerLoaded, null, Laya.Loader.JSON);
    }
    // 加载数据
    private openServerListLoaded() {
        this.loginDialog.set_visible(false);
        this.serverBox.set_visible(true);
        this.loginInfo.set_visible(false);

        let json: JSON = Laya.loader.getRes("../server.json");

        let servers = json["servers"];
        for (const key in servers) {
            if (Object.prototype.hasOwnProperty.call(servers, key)) {
                const element = servers[key];
                let sname: string = element["name"];
                let id: number = Number(element["id"]);
                let ws: string = element["ws"];
                let ip: string = element["ip"];
                let port: number = Number(element["port"]);
                let state: number = Number(element["state"]);
                this.servers.push({sname: sname, id: id, ws: ws, ip: ip, port: port, state: state});
            }
        }

        let group = json["group"];
        for (const num in group) {
            let groupItem = group[num];
            let begin: number = Number(num) * Number(groupItem["amount"]) + 1;
            let end: number = begin + Number(groupItem["amount"]) - 1;
            let gname: string = groupItem["name"];
            this.groups.push({gname: gname, begin: begin, end: end});
        }

        this.showServerGroup();
        this.showServerList();
        this.onSelectGroup(0);
    }
    // 显示服务器组
    private showServerGroup() {
        this.serverGroup.vScrollBarSkin = "";
        this.serverGroup.itemRender = Group;
        this.serverGroup.array = this.groups;
        this.serverGroup.selectEnable = true;
        this.serverGroup.renderHandler = new Laya.Handler(this, this.updateGroupItem);
        this.serverGroup.selectHandler = new Laya.Handler(this, this.onSelectGroup);
    }
    private updateGroupItem(item: Group, index: number) {
        item.onSetData(item.dataSource["gname"]);
    }
    private onSelectGroup(index: number) {
        let item: Group = this.serverGroup.getItem(index);
        this.onShowServer(item.begin, item.end);
    }

    // 显示服务器组内列表
    private showServerList() {
        this.serverList.itemRender = Server;
        this.serverList.selectEnable = true;
        this.serverList.renderHandler = new Laya.Handler(this, this.updateServerItem);
        this.serverList.selectHandler = new Laya.Handler(this, this.onSelectServer);
    }
    private updateServerItem(item: Server, index: number) {
        item.onSetData(item.dataSource["sname"]);
    }
    private onSelectServer(index: number) {
        let item: Server = this.serverList.getItem(index);
        global.server.id    = item.id;
        global.server.name  = item.sname;
        global.server.ip    = item.ip;
        global.server.port  = item.port;
        global.server.ws    = item.ws;
        global.server.state = item.state;

        this.openServerInfo();
    }

    // 根据服务器组显示服务器列表
    private onShowServer(begin: number, end: number) {
        let arr = [];
        for (const key in this.servers) {
            if (Object.prototype.hasOwnProperty.call(this.servers, key)) {
                const element = this.servers[key];
                let id = element["id"];
                if (id >= begin && id <= end) {
                    arr.push(element);
                }
            }
        }
        this.serverList.array = arr;
    }

    ////////////////////////////////////////////////////////////////////////////
    private openServerInfo() {
        this.loginDialog.set_visible(false);
        this.serverBox.set_visible(false);
        this.loginInfo.set_visible(true);

        this.serverName.text = global.server.name;
        this.serverState.text = String(global.server.state);
    }

    private onBtnConnect(button:Laya.Button) {
        if (0 == global.server.state) {
            console.log("未开");
            return;
        }
        socket.connectByUrl();
    }

    private chooseServer() {
        this.loginDialog.set_visible(false);
        this.serverBox.set_visible(true);
        this.loginInfo.set_visible(false);

        this.onSelectGroup(0);
    }
}


class Group extends Laya.Box {
    public gname: string;
    public begin: number;
    public end: number;

    private label: Laya.Label;

    constructor() {
        super();
        this.graphics.drawRect(10, 10, 120, 30, null, "#FF0000");
        this.bgColor = "#666666";
        this.pos(18, 10);
        this.label = new Laya.Label();
        this.label.size(120, 30);
        this.label.bgColor = "#555555";
        this.label.align = "center";
        this.label.valign = "middle";
        this.addChild(this.label);

        this.gname = "";
        this.begin = 0;
        this.end = 0;
    }

    public onSetData(name: string) {
        this.label.text = name;
    }
}

class Server extends Laya.Box {
    public sname: string;
    public id: number;
    public ws: string;
    public ip: string;
    public port: number;
    public state: number;

    private label: Laya.Label;
    constructor() {
        super();
        this.graphics.drawRect(10, 10, 140, 50, null, "#FF0000");
        this.bgColor = "#666666";
        this.pos(10, 15);
        this.label = new Laya.Label();
        this.label.size(140, 50);
        this.label.bgColor = "#555555";
        this.label.align = "center";
        this.label.valign = "middle";
        this.label.text = "";
        this.addChild(this.label);

        this.sname = "";
        this.id = 0;
        this.ws = "";
        this.ip = "";
        this.port = 0;
        this.state = 0;
    }

    public onSetData(name: string) {
        this.label.text = name;
    }
}

