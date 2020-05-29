const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {
    path_audio_skill: string = "Audio/Skill/";
    audio_Hit_ZhongJi: string = "Hit_ZhongJi";
    audio_Hit_BingJian: string = "Hit_BingJian";

    onLoad() {
        window.audioMgr = this;
    }

    playSound(path: string, name: string, loop?: boolean) {
        cc.audioEngine.playEffect(
            cc.loader.getRes(
                path + name, cc.AudioClip
            ), 
            (loop == undefined ? false : loop)
        );
    }
}
