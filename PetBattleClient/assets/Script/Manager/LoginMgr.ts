import { JCEngine, JCEntity } from "../SDK/JCEngine";
import Player from "../Player/Player";
import GlobalData from "../Common/GlobalData";
import Camper from "../Common/Camper";
import JCTool from "../SDK/JCTool";
import ResourceMgr from "./ResourceMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({type: cc.Sprite}) 
    checkBoxSprite: cc.Sprite = null;
    @property({type: cc.SpriteFrame})
    checkBoxFrames: cc.SpriteFrame[] = [];

    @property({type: cc.EditBox})
    input_username: cc.EditBox = null;
    @property({type: cc.EditBox})
    input_password1: cc.EditBox = null;
    @property({type: cc.EditBox})
    input_password2: cc.EditBox = null;

    isLoginPanel: boolean = true;
    isRemember: boolean = false;

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        this.checkRemember();

        let url = "ws://192.168.101.14:9999/petBattleServer";
        // let url = "ws://118.89.184.186:9999/petBattleServer";
        JCEngine.boot(url, Player);

        //if local test, suport input username and password by q or w
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {
            if (!url.startsWith("ws://192.168")) {
                return;
            }
            if (event.keyCode == cc.macro.KEY.q) {
                this.input_username.string = "123456";
                this.input_password1.string = "123456";
            } else if (event.keyCode == cc.macro.KEY.w) {
                this.input_username.string = "asdfgh";
                this.input_password1.string = "asdfgh";
            }
        }, this);
    }

    checkRemember() {
        let loginInfoStr = localStorage.getItem("userLogin");
        if (loginInfoStr) {
            try {
                let userLogin: UserLogin = JSON.parse(loginInfoStr);
                this.input_username.string = userLogin.username;
                this.input_password1.string = userLogin.username;
                this.isRemember = true;
                this.renderRemember();
            } catch {}
        }
    }

    remember() {
        if (this.isRemember){
            this.isRemember = false;
        } else {
            this.isRemember = true;
        }
        this.renderRemember();
    }

    renderRemember() {
        if (this.isRemember) {
            this.checkBoxSprite.spriteFrame = this.checkBoxFrames[1];
        } else {
            this.checkBoxSprite.spriteFrame = this.checkBoxFrames[0];
        }
    }

    login() {
        if (this.isLoginPanel) {
            if (this.input_username.string.length < 6) {
                Camper.getInstance().showToast("账号长度至少6位");
                return;
            }
            if (!JCTool.isLetterOrNum(this.input_username.string)) {
                Camper.getInstance().showToast("账号只能为字母和数字");
                return;
            }
            if (this.input_password1.string.length < 6) {
                Camper.getInstance().showToast("密码长度至少6位");
                return;
            }
            
            if (JCTool.hasChinese(this.input_password1.string)) {
                Camper.getInstance().showToast("密码不能包含中文");
                return;
            }
            let userLogin: UserLogin = {
                username: this.input_username.string,
                password: this.input_password1.string
            };
            GlobalData.player.call("UserController.login", [userLogin.username, userLogin.password], (res) => {
                Camper.getInstance().hideLoading();
                if (res.code == 200) {
                    if (this.isRemember) {
                        localStorage.setItem("userLogin", JSON.stringify(userLogin));
                    } else {
                        localStorage.setItem("userLogin", "");
                    }
                    GlobalData.userInfo = res.data;
                    Camper.getInstance().node.addComponent(ResourceMgr);
                } 
                Camper.getInstance().showToast(res.msg);
            });
            Camper.getInstance().showLoading("登录中");
        } else {
            this.isLoginPanel = true;
            this.input_password2.node.parent.active = false;
            this.checkBoxSprite.node.parent.active = true;
            this.input_username.string = "";
            this.input_password1.string = "";
            this.input_password2.string = "";
        }
    }

    register() {
        if (this.isLoginPanel) {
            this.isLoginPanel = false;
            this.input_password2.node.parent.active = true;
            this.checkBoxSprite.node.parent.active = false;
            this.input_username.string = "";
            this.input_password1.string = "";
            this.input_password2.string = "";
        } else {
            if (this.input_username.string.length < 6) {
                Camper.getInstance().showToast("账号长度至少6位");
                return;
            }
            if (!JCTool.isLetterOrNum(this.input_username.string)) {
                Camper.getInstance().showToast("账号只能为字母和数字");
                return;
            }
            if (this.input_password1.string.length < 6) {
                Camper.getInstance().showToast("密码长度至少6位");
                return;
            }
            
            if (JCTool.hasChinese(this.input_password1.string)) {
                Camper.getInstance().showToast("密码不能包含中文");
                return;
            }
            if (this.input_password1.string != this.input_password2.string) {
                Camper.getInstance().showToast("两次输入的密码不匹配");
                return;
            }
            let userLogin: UserLogin = {
                username: this.input_username.string,
                password: this.input_password1.string
            };
            GlobalData.player.call("UserController.register", [userLogin.username, userLogin.password], (res) => {
                Camper.getInstance().hideLoading();
                Camper.getInstance().showToast(res.msg);
            });
            Camper.getInstance().showLoading("注册中");
        }
    }
}
interface UserLogin {
    username: string;
    password: string;
}