
export default class BaseScene extends Laya.Scene {

    constructor() {
        super();
    }

    protected createChildren() {
        super.createChildren();
    }

    onAwake() {
        super.onAwake();
    }

    onEnable() {
        this.initView();
        this.initListener();
    }

    initView() {
    }

    initListener() {
    }

    onDisable() {
    }

}