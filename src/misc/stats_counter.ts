class StatsCounter {
    public cache_hits: number;
    public cache_misses: number;

    constructor() {
        this.cache_hits = 0;
        this.cache_misses = 0;
    }

    getOriginalFiles(): number {
        return 0;
    }
    getResizedFiles(): number {
        return 0;
    }
}

export default StatsCounter;