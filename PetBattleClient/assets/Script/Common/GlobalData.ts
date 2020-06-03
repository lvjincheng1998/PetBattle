import Player from "../Player/Player";
import ResourceMgr from "../Manager/ResourceMgr";

export default class GlobalData {
    //instance
    static player: Player;
    //userData
    static userInfo: UserInfo = {
        id: 10000000,
        nickname: "超菜凡",
        gender: 1,
        avatarUrl: "http://118.89.184.186:888/avatar/cartoon/girl/1.jpg",
        coin: 30000,
        diamond: 5000,
        strength: 120,
        integral: 1000
    };

    static userPetInfos: UserPetInfo[] = [];
    static userPropInfos: UserPropInfo[] = [];
    static userEquipmentInfos: UserEquipmentInfo[] = [];
    static userEmbattleInfos: UserEmbattleInfo[] = [];

    static setEmbattleInfos(userEmbattles: UserEmbattle[]) {
        let arr: UserEmbattleInfo[] = [];
        for (let userEmbattle of userEmbattles) {
            arr[userEmbattle.sequence_id] = {
                userEmbattle: userEmbattle,
                userPetInfo: this.getUserPetInfo(userEmbattle.user_pet_id)
            };
        }
        for (let i = 0; i < 6; i++) {
            if (!arr[i]) {
                arr[i] = null;
            }
        }
        this.userEmbattleInfos = arr;
    }

    static isOnEmbattle(user_pet_id: number): boolean {
        for (let userEmbattleInfo of this.userEmbattleInfos) {
            if (userEmbattleInfo && userEmbattleInfo.userEmbattle.user_pet_id == user_pet_id) {
                return true;
            }
        }
        return false;
    }

    static countEmbattleInfo(): number {
        let count = 0;
        for (let embattleInfo of this.userEmbattleInfos) {
            if (embattleInfo) {
                count++;
            }
        }
        return count;
    }

    static createUserPetInfo(userPet: UserPet, ignoreEquipment?: boolean): UserPetInfo {
        let petInfo = JSON.parse(JSON.stringify(ResourceMgr.getPetInfo(userPet.pet_id)));
        let userPetStatus = this.calculateStatus(userPet, petInfo);
        let userEquipmentInfos = [];
        if (!ignoreEquipment) {
            for (let userEquipmentInfo of GlobalData.userEquipmentInfos) {
                if (userEquipmentInfo.userEquipment.user_pet_id == userPet.id) {
                    if (userEquipmentInfo.equipmentInfo.name.endsWith("护目")) {
                        userEquipmentInfos[0] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("手镯")) {
                        userEquipmentInfos[1] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("头饰")) {
                        userEquipmentInfos[2] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("项链")) {
                        userEquipmentInfos[3] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("尖牙")) {
                        userEquipmentInfos[4] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("星石")) {
                        userEquipmentInfos[5] = userEquipmentInfo;
                    }
                    for (let key in userEquipmentInfo.userEquipment.main_status) {
                        let value = userEquipmentInfo.userEquipment.main_status[key];
                        userPetStatus[key][1] += value;
                        userPetStatus[key][2] += value;
                    }
                    for (let key in userEquipmentInfo.userEquipment.vice_status) {
                        let value = userEquipmentInfo.userEquipment.vice_status[key];
                        userPetStatus[key][1] += value;
                        userPetStatus[key][2] += value;
                    }
                }
            }
        }
        let strength = this.calculateStrength(userPetStatus);
        let userPetInfo = {
            userPet: userPet,
            petInfo: petInfo,
            strength: strength,
            userPetStatus: userPetStatus,
            userEquipmentInfos: userEquipmentInfos
        };
        return userPetInfo;
    }

    static getUserPetInfo(user_pet_id: number) {
        for (let userPetInfo of this.userPetInfos) {
            if (userPetInfo.userPet.id == user_pet_id) {
                return userPetInfo;
            }
        }
    }

    static setUserPetInfos(userPets: UserPet[]) {
        let userPetInfos: UserPetInfo[] = [];
        for (let userPet of userPets) {
            userPetInfos.push(this.createUserPetInfo(userPet));
        }
        this.userPetInfos = userPetInfos;
    }

    static addUserPetInfos(userPets: UserPet[]) {
        for (let userPet of userPets) {
            let userPetInfo = this.createUserPetInfo(userPet);
            let replace = false;
            for (let i in this.userPetInfos) {
                if (this.userPetInfos[i].userPet.id == userPet.id) {
                    this.userPetInfos[i] = userPetInfo;
                    replace = true;
                    break;
                }
            }
            if (!replace) {
                this.userPetInfos.push(userPetInfo);
            }
        }
    }

    static removeUserPetInfos(userPets: UserPet[]) {
        if (this.userPetInfos.length == 0) {
            return;
        }
        for (let i = this.userPetInfos.length - 1; i >= 0; i--) {
            let userPetInfo = this.userPetInfos[i];
            for (let userPet of userPets) {
                if (userPet.id == userPetInfo.userPet.id) {
                    this.userPetInfos.splice(i, 1);
                }
            }
        }
    }

    static getUserPropInfo(prop_id: number) {
        for (let userPropInfo of this.userPropInfos) {
            if (userPropInfo.userProp.prop_id == prop_id) {
                return userPropInfo;
            }
        }
    }

    static setUserPropInfos(userProps: UserProp[]) {
        let userPropInfos = [];
        for (let userProp of userProps) {
            userPropInfos.push({
                userProp: userProp,
                propInfo: ResourceMgr.getPropInfo(userProp.prop_id)
            });
        }
        this.userPropInfos = userPropInfos;
    }

    static removeUserPropInfos(userProps: UserProp[]) {
        if (this.userPropInfos.length == 0) {
            return;
        }
        for (let i = this.userPropInfos.length - 1; i >= 0; i--) {
            let userPropInfo = this.userPropInfos[i];
            for (let userProp of userProps) {
                if (userProp.id == userPropInfo.userProp.id) {
                    this.userPropInfos.splice(i, 1);
                }
            }
        }
    }

    static createUserEquipmentInfo(userEquipment: UserEquipment) {
        userEquipment.main_status = JSON.parse(userEquipment.main_status);
        userEquipment.vice_status = JSON.parse(userEquipment.vice_status);
        let statusName = null;
        for (let sn in userEquipment.main_status) {
            statusName = sn;
        }
        userEquipment.main_status[statusName] = userEquipment.main_status[statusName] * (100 + userEquipment.strength_level * 3 + userEquipment.star_level * 6) /100;
        userEquipment.main_status[statusName] = Math.floor(userEquipment.main_status[statusName]);
        return {
            userEquipment: userEquipment,
            equipmentInfo: ResourceMgr.getEquipmentInfo(userEquipment.equipment_id)
        };
    }
    static setUserEquipmentInfos(userEquipments: UserEquipment[]) {
        let userEquipmentInfos = [];
        for (let userEquipment of userEquipments) {
            userEquipmentInfos.push(this.createUserEquipmentInfo(userEquipment));
        }
        this.userEquipmentInfos = userEquipmentInfos;
    }

    static removeUserEquipmentInfos(userEquipments: UserEquipment[]) {
        if (this.userEquipmentInfos.length == 0) {
            return;
        }
        for (let i = this.userEquipmentInfos.length - 1; i >= 0; i--) {
            let userEquipmentInfo = this.userEquipmentInfos[i];
            for (let userEquipment of userEquipments) {
                if (userEquipment.id == userEquipmentInfo.userEquipment.id) {
                    this.userEquipmentInfos.splice(i, 1);
                }
            }
        }
    }

    static updateUserPropInfos(userProps: UserProp[]) {
        for (let userProp of userProps) {
            let userPropInfo = {
                userProp: userProp,
                propInfo: ResourceMgr.getPropInfo(userProp.prop_id)
            }
            let replace = false;
            for (let i = this.userPropInfos.length - 1; i >= 0; i--) {
                if (this.userPropInfos[i].userProp.id == userProp.id) {
                    this.userPropInfos[i] = userPropInfo;
                    if (this.userPropInfos[i].userProp.amount == 0) {
                        this.userPropInfos.splice(i, 1);
                    }
                    replace = true;
                    break;
                }
            }
            if (!replace) {
                this.userPropInfos.push(userPropInfo);
            }
        }
    }

    static calculateStrength(userPetStatus: UserPetStatus): number {
        let strength = 0;
        for (let status in userPetStatus) {
            if (status == "hp") {
                strength += userPetStatus[status][2];
            } else if (status == "attack") {
                strength += userPetStatus[status][2] * 10;
            } else if (status == "defense") {
                strength += userPetStatus[status][2] * 5;
            } else if (status == "speed") {
                strength += userPetStatus[status][2] * 20;
            } else if (status == "critRate") {
                strength += userPetStatus[status][2] * 150;
            } else if (status == "critHurt") {
                strength += (userPetStatus[status][2] - 150) * 100 + 500;
            } else if (status == "hit") {
                strength += userPetStatus[status][2] * 100;
            } else if (status == "resist") {
                strength += userPetStatus[status][2] * 90;
            }
        }
        return Math.floor(strength);
    }

    static calculateStatus(userPet: UserPet, petInfo: PetInfo): UserPetStatus {
        let userPetStatus: UserPetStatus = {
            hp: [],
            attack: [],
            defend: [],
            critRate: [],
            critHurt: [],
            speed: [],
            hit: [],
            resist: []
        };
        let mainStatus = this.calculateMainStatus(userPet.pet_level, petInfo);
        userPetStatus.hp.push(mainStatus[0]);
        userPetStatus.attack.push(mainStatus[1]);
        userPetStatus.defend.push(mainStatus[2]);
        userPetStatus.speed.push(petInfo.status.speed);
        userPetStatus.critRate.push(petInfo.status.critRate);
        userPetStatus.critHurt.push(petInfo.status.critHurt);
        userPetStatus.hit.push(petInfo.status.hit);
        userPetStatus.resist.push(petInfo.status.resist);
        let breakStatus = this.calculateBreakStatus(userPet.break_level, petInfo.rarity);
        userPetStatus.hp.push(breakStatus[0] + Math.floor(mainStatus[0] * userPet.blood_level * 3 / 100));
        userPetStatus.attack.push(breakStatus[1] + Math.floor(mainStatus[1] * userPet.blood_level * 3 / 100));
        userPetStatus.defend.push(breakStatus[2] + Math.floor(mainStatus[2] * userPet.blood_level * 3 / 100));
        userPetStatus.speed.push(0);
        userPetStatus.critRate.push(0);
        userPetStatus.critHurt.push(0);
        userPetStatus.hit.push(0);
        userPetStatus.resist.push(0);
        userPetStatus.hp.push(userPetStatus.hp[0] + userPetStatus.hp[1]);
        userPetStatus.attack.push(userPetStatus.attack[0] + userPetStatus.attack[1]);
        userPetStatus.defend.push(userPetStatus.defend[0] + userPetStatus.defend[1]);
        userPetStatus.speed.push(userPetStatus.speed[0] + userPetStatus.speed[1]);
        userPetStatus.critRate.push(userPetStatus.critRate[0] + userPetStatus.critRate[1]);
        userPetStatus.critHurt.push(userPetStatus.critHurt[0] + userPetStatus.critHurt[1]);
        userPetStatus.hit.push(userPetStatus.hit[0] + userPetStatus.hit[1]);
        userPetStatus.resist.push(userPetStatus.resist[0] + userPetStatus.resist[1]);
        return userPetStatus;
    }

    static calculateMainStatus(level: number, petInfo: PetInfo): number[] {
        return [
            Math.floor(petInfo.status.hp * Math.pow(1028, level) / Math.pow(1000, level)),
            Math.floor(petInfo.status.attack * Math.pow(1035, level) / Math.pow(1000, level)),
            Math.floor(petInfo.status.defend * Math.pow(1034, level) / Math.pow(1000, level))
        ];
    }

    static calculateBreakStatus(level: number, rarity: string) {
        let basic_status: number[] = [0, 0, 0];
        if (level == 0) {
            return basic_status;
        } 
        let rate = 1.1;
        let total_status: number[] = [0, 0, 0];
        if (rarity == "R") {
            basic_status = [120, 30, 15];
        } else if (rarity == "SR") {
            basic_status = [150, 35, 18];
        } else if (rarity == "SSR") {
            basic_status = [180, 40, 21];
        } else if (rarity == "SP") {
            basic_status = [210, 45, 24];
        }
        for (let i = 0; i < level; i++) {
            for (let j = 0; j < 3; j++) {
                total_status[j] += Math.floor(basic_status[j] * Math.pow(rate * 1000, i) / Math.pow(1000, i));
            }
        }
        return total_status;
    }

    static calculateLevelExp(exp: number): number[] {
        let levelExpRate = 100;
        let levelExpTotal = 0;
        let currentLevelExp = 0;
        let currentLevelExpMax = 0;
        for (let i = 0; i < 100; i++) {
            let nextLevelExp = (i + 1) * levelExpRate;
            if (exp >= levelExpTotal + nextLevelExp) {
                levelExpTotal += nextLevelExp;
            } else {
                currentLevelExp = exp - levelExpTotal;
                currentLevelExpMax = nextLevelExp;
                break;
            }
        }
        return [currentLevelExp, currentLevelExpMax];
    }
}
declare global {
    interface UserInfo {
        id: number;
        nickname: string;
        gender: number;
        avatarUrl: string;
        coin: number;
        diamond: number;
        strength: number;
        integral: number;
    }
    interface UserPetInfo {
        userPet: UserPet;
        petInfo: PetInfo;
        strength: number;
        userPetStatus: UserPetStatus;
        userEquipmentInfos: UserEquipmentInfo[];
    }
    interface UserPet {
        id: number;
        user_id: number;
        pet_id: number;
        pet_level: number;
        blood_level: number;
        break_level: number;
        pet_exp: number;
        blood_exp: number;
        fragment: number;
    }
    interface UserPetStatus {
        hp: number[];
        attack: number[];
        defend: number[];
        critRate: number[];
        critHurt: number[];
        speed: number[];
        hit: number[];
        resist: number[];
    }
    interface UserEmbattleInfo {
        userEmbattle: UserEmbattle;
        userPetInfo: UserPetInfo;
    }
    interface UserEmbattle {
        id: number;
        user_id: number;
        user_pet_id: number;
        sequence_id: number;
    }
    interface UserProp {
        id: number;
        user_id: number;
        prop_id: number;
        amount: number;
    }
    interface UserPropInfo {
        userProp: UserProp;
        propInfo: PropInfo;
    }
    interface UserEquipmentInfo {
        userEquipment: UserEquipment;
        equipmentInfo: EquipmentInfo;
    }
    interface UserEquipment {
        id: number;
        user_id: number;
        equipment_id: number;
        main_status: any;
        vice_status: any;
        strength_level: number;
        star_level: number;
        user_pet_id: number;
    }
}
