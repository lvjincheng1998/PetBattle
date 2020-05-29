import GameMgr from "../Manager/GameMgr";
import BattleMgr from "../Manager/BattleMgr";
import AudioMgr from "../Manager/AudioMgr";
import Player from "../Player/Player";

export {}

declare global {

    interface Window {
        battleMgr: BattleMgr;
        audioMgr: AudioMgr;
        player: Player;
    }

    interface PetInfo {
        id: number;
        index: number;
        name: string;
        rarity: string;
        department: string;
        status: PetStatus;
        skills: PetSkill[];
    }

    interface PropInfo {
        id: number;
        name: string;
        rarity: string;
        classify: string;
        introduce: string;
    }

    interface EquipmentInfo {
        id: number;
        name: string;
        rarity: string;
        introduce: string;
    }

    interface PetStatus {
        hp: number;
        attack: number;
        defend: number;
        critRate: number;
        critHurt: number;
        speed: number;
        hit: number;
        resist: number;
    }

    interface PetSkill {
        name: string;
        explain: string;
        energy: number;   
    }
}
