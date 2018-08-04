import { readdirSync } from "fs";
import diskusage from 'diskusage';
import os from 'os';
import path from 'path';
import _ from 'lodash';

class StatsCounter {
    public cache_hits: number;
    public cache_misses: number;
    constructor(private path: string) {
        this.cache_hits = 0;
        this.cache_misses = 0;
    }
    getOriginalFiles(): number {
        return readdirSync(this.path).length;
    }
    getResizedFiles(): number {
        return readdirSync(path.join(this.path, 'resized')).length;
    }
    getProcessInfo(): object {
        return {
            pid: process.pid,
            uptime: (process.uptime() / 60).toFixed(2),
            platform: process.platform,
            memory_usage: { free: os.freemem() / Math.pow(1024, 3), total: os.totalmem() / Math.pow(1024, 3) },
        }
    }
    getDiskSpace(): object {
        // Check the partition space
        return _.mapValues(diskusage.checkSync(this.path), (value) => (value / Math.pow(1024, 3)).toFixed(3));
    }
}

export default StatsCounter;