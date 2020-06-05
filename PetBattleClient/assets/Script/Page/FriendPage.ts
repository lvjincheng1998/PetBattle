import GlobalData from "../Common/GlobalData";
import JCLib from "../SDK/JCLib";
import ResourceMgr from "../Manager/ResourceMgr";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FriendPage extends cc.Component {
    @property({type: cc.Node})
    buttonList: cc.Node = null;

    currentChildWindonwId: number = 1;
    privateChatTarget: any = null;
    static friendChat_map = new Map<number, FriendChat[]>();
    static friendChatPublic_list: FriendChatPublic[]  = [];
    static instance: FriendPage;
    addFriendTarget: FriendChatPublic;

    onLoad() {
        FriendPage.instance = this;
        this.hideChildWindows();
        this.buttonList.children.forEach(c => {
            c.on(cc.Node.EventType.TOUCH_END, () => {
                if (c == this.buttonList.children[1] && !this.privateChatTarget) {
                    Camper.getInstance().showToast("请先选择聊天对象");
                    return;
                }
                this.buttonList.children.forEach(c => {
                    c.color = cc.Color.WHITE;
                });
                c.color = cc.color(0, 255, 155);
                this.hideChildWindows();
                if (c == this.buttonList.children[0]) {
                    JCLib.getComponentByPath(this.node, "Window/Title/Label", cc.Label).string = "好友列表";
                    GlobalData.player.call("FriendController.loadFriends", [], (res) => {
                        this.showChildWindow(1);
                        this.renderFriends(res);
                    });
                } else if (c == this.buttonList.children[1]) {
                    JCLib.getComponentByPath(this.node, "Window/Title/Label", cc.Label).string = "与好友（"+ this.privateChatTarget.nickname +"）的私聊频道";
                    this.showChildWindow(2);
                    this.renderPrivateMsg();
                } else if (c == this.buttonList.children[2]) {
                    JCLib.getComponentByPath(this.node, "Window/Title/Label", cc.Label).string = "世界聊天频道";
                    this.showChildWindow(3);
                    this.renderPublicMsg();
                }
            });
        });
        this.buttonList.children[0].emit(cc.Node.EventType.TOUCH_END);
    }

    hideChildWindows() {
        for (let i = 1; i <=3; i++) {
            JCLib.getNodeByPath(this.node, "Window/ChildWindow" + i).active = false;
        }
    }

    showChildWindow(id: number) {
        this.currentChildWindonwId = id;
        JCLib.getNodeByPath(this.node, "Window/ChildWindow" + id).active = true;
    }

    renderFriends(friends: any[]) {
        let itemSample = JCLib.getNodeByPath(this.node, "Window/ChildWindow1/Content/Item");
        let content = JCLib.getNodeByPath(this.node, "Window/ChildWindow1/Content");
        content.children[0].active = false;
        content.children.forEach((c, i) => {
            if (i > 0) {
                c.destroy();
            }
        });
        friends.sort((a, b) => {
            return b.newMsgCount - a.newMsgCount;
        });
        for (let friend of friends) {
            let item = cc.instantiate(itemSample);
            item.active = true;
            content.addChild(item);
            ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(item, "Photo/Mask/Sprite", cc.Sprite), friend.avatarUrl);
            item.getChildByName("Segment").getComponent(cc.Label).string = ResourceMgr.getSegmentByIntegral(friend.integral);
            item.getChildByName("Nickname").getComponent(cc.Label).string = friend.nickname;
            if (friend.newMsgCount > 0) {
                let msgNew = item.getChildByName("MsgNew").getComponent(cc.Label);
                msgNew.node.active = true;
                if (friend.newMsgCount < 100) {
                    msgNew.string = "新消息(" + friend.newMsgCount +")";
                } else {
                    msgNew.string = "新消息(99+)";
                }
            }
            item.getChildByName("IconDelete").on(cc.Node.EventType.TOUCH_END, () => {
                GlobalData.player.call("FriendController.deleteFriend", [friend.id], (res) => {
                    if (res) {
                        item.destroy();
                        Camper.getInstance().showToast("删除成功");
                    } 
                });
            });
            item.getChildByName("IconChat").on(cc.Node.EventType.TOUCH_END, () => {
                this.privateChatTarget = friend;
                this.buttonList.children[1].emit(cc.Node.EventType.TOUCH_END);
            });
            item.on("newMsgCount", (friend_id) => {
                if (friend.friend_id == friend_id) {
                    friend.newMsgCount++;
                    if (friend.newMsgCount > 0) {
                        let msgNew = item.getChildByName("MsgNew").getComponent(cc.Label);
                        msgNew.node.active = true;
                        if (friend.newMsgCount < 100) {
                            msgNew.string = "新消息(" + friend.newMsgCount +")";
                        } else {
                            msgNew.string = "新消息(99+)";
                        }
                    }
                }
            });
        }
    }

    renderPrivateMsg() {
        JCLib.getComponentByPath(this.node, "Window/ChildWindow2/Input", cc.EditBox).string = "";
        let content = JCLib.getNodeByPath(this.node, "Window/ChildWindow2/ScrollView/Content");
        let sample_mine = content.children[0];
        let sample_other = content.children[1];
        sample_mine.active = false;
        sample_other.active = false;
        let friend_id = this.privateChatTarget.friend_id;
        GlobalData.player.call("FriendController.loadFriendMsg", [friend_id], (res: FriendChat[]) => {
            let msg_ids = [];
            let list = FriendPage.friendChat_map.get(friend_id);
            if (list) {
                for (let friendChat of res) {
                    msg_ids.push(friendChat.id);
                    let exist = false;
                    for (let elem of list) {
                        if (friendChat.id == elem.id) {
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        list.push(friendChat);
                    }
                }
            } else {
                list = res;
                FriendPage.friendChat_map.set(friend_id, list);
                for (let friendChat of res) {
                    msg_ids.push(friendChat.id);
                }
            }
            list.sort((a, b) => {
                return a.send_time - b.send_time;
            });
            for(let i = 2; i < content.children.length; i++) {
                content.children[i].destroy();
            }
            for (let friendChat of list) {
                let item = null;
                let nickname = "";
                let avatarUrl = "";
                if (friendChat.sender_id == GlobalData.userInfo.id) {
                   item = cc.instantiate(sample_mine);
                   nickname = GlobalData.userInfo.nickname;
                   avatarUrl = GlobalData.userInfo.avatarUrl;
                } else {
                    item = cc.instantiate(sample_other);
                    nickname = this.privateChatTarget.nickname;
                    avatarUrl = this.privateChatTarget.avatarUrl;
                }
                item.active = true;
                content.addChild(item);
                ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(item, "Photo/Mask/Sprite", cc.Sprite), avatarUrl);
                JCLib.getComponentByPath(item, "Nickname", cc.Label).string = nickname;
                JCLib.getComponentByPath(item, "Label", cc.Label).string = friendChat.message;
            }
            this.scheduleOnce(() => {
                this.scrollToBottom(JCLib.getNodeByPath(this.node, "Window/ChildWindow2/ScrollView"));
            }, 0.1);
            if (msg_ids.length > 0) {
                GlobalData.player.call("FriendController.readPrivateMsg", [msg_ids]);
            }
        });
    }

    renderPublicMsg() {
        JCLib.getComponentByPath(this.node, "Window/ChildWindow3/Input", cc.EditBox).string = "";
        let content = JCLib.getNodeByPath(this.node, "Window/ChildWindow3/ScrollView/Content");
        let sample_mine = content.children[0];
        let sample_other = content.children[1];
        sample_mine.active = false;
        sample_other.active = false;
        for(let i = 2; i < content.children.length; i++) {
            content.children[i].destroy();
        }
        for (let friendChatPublic of FriendPage.friendChatPublic_list) {
            let item = null;
            if (friendChatPublic.player_id == GlobalData.userInfo.id) {
               item = cc.instantiate(sample_mine);
            } else {
                item = cc.instantiate(sample_other);
            }
            item.active = true;
            content.addChild(item);
            ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(item, "Photo/Mask/Sprite", cc.Sprite), friendChatPublic.avatarUrl);
            JCLib.getComponentByPath(item, "Nickname", cc.Label).string = friendChatPublic.nickname;
            JCLib.getComponentByPath(item, "Label", cc.Label).string = friendChatPublic.message;
            (item as cc.Node).on(cc.Node.EventType.TOUCH_END, () => {
                this.renderAddFriendPanel(friendChatPublic);
            });
        }
        FriendPage.instance.scheduleOnce(() => {
            FriendPage.instance.scrollToBottom(JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow3/ScrollView"));
        }, 0.1);
    }

    scrollToBottom(scrollViewNode: cc.Node) {
        let content = scrollViewNode.getChildByName("Content");
        if (content.height > scrollViewNode.height) {
            let offsetY = content.height - scrollViewNode.height;
            content.y = scrollViewNode.height / 2 + offsetY;
        }
    }

    sendPrivateMsg() {
        let input = JCLib.getComponentByPath(this.node, "Window/ChildWindow2/Input", cc.EditBox);
        if (!input.string.trim()) {
            Camper.getInstance().showToast("发送内容不能为空");
            return;
        }
        GlobalData.player.call("FriendController.sendPrivateMsg", [this.privateChatTarget.friend_id, input.string], (res) => {
            input.string = "";
        });
    }

    sendPublicMsg() {
        let input = JCLib.getComponentByPath(this.node, "Window/ChildWindow3/Input", cc.EditBox);
        if (!input.string.trim()) {
            Camper.getInstance().showToast("发送内容不能为空");
            return;
        }
        GlobalData.player.call("FriendController.sendPublicMsg", [input.string], () => {
            input.string = "";
        });
    }

    static pushPrivateMsg(friendChat: FriendChat) {
        let friend_id = 0;
        let nickname = "";
        let avatarUrl = "";
        if (friendChat.sender_id == GlobalData.userInfo.id) {
            friend_id = friendChat.receiver_id;
        } else {
            friend_id = friendChat.sender_id;
        }
        let list = this.friendChat_map.get(friend_id);
        if (list) {
            list.push(friendChat);
        } else {
            this.friendChat_map.set(friend_id, [friendChat]);
        }
        if (FriendPage.instance && 
            FriendPage.instance.isValid && 
            FriendPage.instance.currentChildWindonwId == 2 && 
            friend_id == FriendPage.instance.privateChatTarget.friend_id
        ) {
            if (friendChat.sender_id == GlobalData.userInfo.id) {
                nickname = GlobalData.userInfo.nickname;
                avatarUrl = GlobalData.userInfo.avatarUrl;
            } else {
                nickname = FriendPage.instance.privateChatTarget.nickname;
                avatarUrl = FriendPage.instance.privateChatTarget.avatarUrl;
            }
            let content = JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow2/ScrollView/Content");
            let sample_mine = content.children[0];
            let sample_other = content.children[1];
            let item = null;
            if (friendChat.sender_id == GlobalData.userInfo.id) {
               item = cc.instantiate(sample_mine);
            } else {
                item = cc.instantiate(sample_other);
            }
            item.active = true;
            content.addChild(item);
            ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(item, "Photo/Mask/Sprite", cc.Sprite), avatarUrl);
            JCLib.getComponentByPath(item, "Nickname", cc.Label).string = nickname;
            JCLib.getComponentByPath(item, "Label", cc.Label).string = friendChat.message;
            FriendPage.instance.scheduleOnce(() => {
                FriendPage.instance.scrollToBottom(JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow2/ScrollView"));
            }, 0.1);
            if (friendChat.sender_id != GlobalData.userInfo.id) {
                GlobalData.player.call("FriendController.readPrivateMsg", [[friendChat.id]]);
            }
        } else if (FriendPage.instance && 
            FriendPage.instance.isValid && 
            FriendPage.instance.currentChildWindonwId == 1 
        ) {
            let content = JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow1/Content");
            content.children.forEach(item => {
                item.emit("newMsgCount", friend_id);
            });
        }
    }

    static pushPublicMsg(friendChatPublic: FriendChatPublic) {
        FriendPage.friendChatPublic_list.push(friendChatPublic);
        if (FriendPage.friendChatPublic_list.length > 100) {
            FriendPage.friendChatPublic_list.shift();
        }
        if (FriendPage.instance && FriendPage.instance.isValid && FriendPage.instance.currentChildWindonwId == 3) {
            let content = JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow3/ScrollView/Content");
            let sample_mine = content.children[0];
            let sample_other = content.children[1];
            let item = null;
            if (friendChatPublic.player_id == GlobalData.userInfo.id) {
               item = cc.instantiate(sample_mine);
            } else {
                item = cc.instantiate(sample_other);
            }
            item.active = true;
            content.addChild(item);
            ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(item, "Photo/Mask/Sprite", cc.Sprite), friendChatPublic.avatarUrl);
            JCLib.getComponentByPath(item, "Nickname", cc.Label).string = friendChatPublic.nickname;
            JCLib.getComponentByPath(item, "Label", cc.Label).string = friendChatPublic.message;
            FriendPage.instance.scheduleOnce(() => {
                FriendPage.instance.scrollToBottom(JCLib.getNodeByPath(FriendPage.instance.node, "Window/ChildWindow3/ScrollView"));
            }, 0.1);
            (item as cc.Node).on(cc.Node.EventType.TOUCH_END, () => {
                FriendPage.instance.renderAddFriendPanel(friendChatPublic);
            });
        }
    }

    renderAddFriendPanel(friendChatPublic: FriendChatPublic) {
        if (friendChatPublic.player_id == GlobalData.userInfo.id) {
            return;
        }
        FriendPage.instance.addFriendTarget = friendChatPublic;
        let panel = FriendPage.instance.node.getChildByName("AddFriendPanel");
        panel.setContentSize(cc.winSize);
        panel.active = true;
        ResourceMgr.setSpriteFrame(JCLib.getComponentByPath(panel, "Layout/Photo/Mask/Sprite", cc.Sprite), friendChatPublic.avatarUrl);
        JCLib.getComponentByPath(panel, "Layout/Layout/Layout1/Segment", cc.Label).string = 
            ResourceMgr.getSegmentByIntegral(friendChatPublic.integral);
        JCLib.getComponentByPath(panel, "Layout/Layout/Layout1/Nickname", cc.Label).string = 
            friendChatPublic.nickname;
    }

    lock_determineAddFriend: boolean = false;
    
    determineAddFriend() {
        if (this.lock_determineAddFriend) {
            return;
        }
        let panel = FriendPage.instance.node.getChildByName("AddFriendPanel");
        panel.active = false;
        this.lock_determineAddFriend = true;
        GlobalData.player.call("FriendController.addFriend", [this.addFriendTarget.player_id], (res) => {
            this.lock_determineAddFriend = false;
            Camper.getInstance().showToast(res);
        });
    }

    cancelAddFriend() {
        let panel = FriendPage.instance.node.getChildByName("AddFriendPanel");
        panel.active = false;
    }
}
interface FriendChatPublic {
    player_id: number;
	nickname: string;
	avatarUrl: string;
	integral: number;
	message: string;
	timestamp: number;
}
interface FriendChat {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    send_time: number;
}