import diskusage from 'diskusage';
import { readdirSync } from 'fs';
import _ from 'lodash';
import os from 'os';
import path from 'path';

class StatsCounter {

	public cacheHits: number;
	public cacheMisses: number;

	constructor(private pathToImages: string) {
		this.cacheHits = 0;
		this.cacheMisses = 0;
	}

	public getOriginalFiles(): number {
		return readdirSync(this.pathToImages).length;
	}

	public getResizedFiles(): number {
		return readdirSync(path.join(this.pathToImages, 'resized')).length;
	}

	public getProcessInfo(): object {
		return {
			memory_usage: { free: os.freemem() / Math.pow(1024, 3), total: os.totalmem() / Math.pow(1024, 3) },
			pid: process.pid,
			platform: process.platform,
			uptime: (process.uptime() / 60).toFixed(2),
		};
	}

	public getDiskSpace(): object {
		// Check the partition space
		return _.mapValues(diskusage.checkSync(this.pathToImages), (value) => (value / Math.pow(1024, 3)).toFixed(3));
	}
}

export default StatsCounter;
