import diskusage from 'diskusage';
import { readdirSync } from 'fs';
import _ from 'lodash';
import os from 'os';
import path from 'path';

class StatsCounter {

	public cacheHits: number;
	public cacheMisses: number;
	public pInfo: object;
	public dInfo: object;
	public originalFiles: number;
	public resizedFiles: number;

	constructor(private pathToImages: string) {
		this.cacheHits = 0;
		this.cacheMisses = 0;
		this.originalFiles = 0;
		this.resizedFiles = 0;
		this.pInfo = {};
		this.dInfo = {};
		this.monitoring(10);
	}

	private getOriginalFiles(): number {
		return readdirSync(this.pathToImages).length;
	}

	private getResizedFiles(): number {
		return readdirSync(path.join(this.pathToImages, 'resized')).length;
	}

	private getProcessInfo(): object {
		return {
			memory_usage: { free: os.freemem() / Math.pow(1024, 3), total: os.totalmem() / Math.pow(1024, 3) },
			pid: process.pid,
			platform: process.platform,
			uptime: (process.uptime() / 60).toFixed(2),
		};
	}

	private getDiskSpace(): object {
		// Check the partition space
		return _.mapValues(diskusage.checkSync(this.pathToImages), (value) => (value / Math.pow(1024, 3)).toFixed(3));
	}

	private getAll(): void {
		this.pInfo = this.getProcessInfo();
		this.dInfo = this.getDiskSpace();
		this.originalFiles = this.getOriginalFiles();
		this.resizedFiles = this.getResizedFiles();
	}
	private monitoring(seconds: number) {
		this.getAll();
		setInterval(this.getAll, seconds * 1000);
	}
}

export default StatsCounter;
