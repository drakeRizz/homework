import { readdirSync } from "fs";

class StatsCounter {
    public cache_hits: number;
    public cache_misses: number;
    public original_files: number;
    public resized_files: number;
    public p_info: object;
    constructor(private path: string) {
        this.cache_hits = 0;
        this.cache_misses = 0;
        this.original_files = this.getOriginalFiles();
        this.resized_files = this.getResizedFiles();
        this.p_info = this.getProcessInfo();
    }
    getOriginalFiles(): number {
        return readdirSync(this.path).length;
    }
    getResizedFiles(): number {
        return readdirSync(this.path + '\\resized').length;
    }
    getProcessInfo(): object{
        return {
            pid: process.pid,
            cpu_usage: process.cpuUsage(),
            memory_usage: process.memoryUsage(),
        }
    }
}

export default StatsCounter;