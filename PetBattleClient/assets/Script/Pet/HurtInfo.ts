export default class HurtInfo {
    attack: number;
    critRate: number;
    critHurt: number;
    hurtRate: number;
    ignoreDefendValue: number = 0;
    ignoreDefendRate: number = 0;

    constructor(
        attack: number, 
        critRate: number, 
        critHurt: number, 
        hurtRate: number,
        ignoreDefendValue?: number, 
        ignoreDefendRate?: number
    ) {
        this.attack = attack;
        this.critRate = critRate;
        this.critHurt = critHurt;
        this.hurtRate = hurtRate;
        if (ignoreDefendValue !== undefined) {
            this.ignoreDefendValue = ignoreDefendValue;
        }
        if (ignoreDefendRate !== undefined) {
            this.ignoreDefendRate = ignoreDefendRate;
        }
    }
}
