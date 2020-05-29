export class Random {
    private static seed1: number = 0;
    private static seed2: number = 0;

    public static setSeed(seed1: number, seed2: number) {
        this.seed1 = seed1;
        this.seed2 = seed2;
    }

    public static randomSeed() {
        this.seed1 = Math.floor(100 * Math.random());
        this.seed2 = Math.floor(100 * Math.random());
    }

    public static nextInt(range: number) {
        this.seed1 += this.seed2;
        return this.seed1 % range;
    }
}