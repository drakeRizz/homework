import fs from 'fs';
import path from 'path';
import process from 'process';
import sharp from 'sharp';
import StatsCounter from './stats_counter';

class ImageResizer {
	public imagesPath = process.env.IMAGES_PATH || path.join(process.cwd(), 'images');
	public stats: StatsCounter;

	constructor() {
		assureCacheDirectoryExistance(this.imagesPath);
		assureCacheDirectoryExistance(path.join(this.imagesPath, 'resized'));
		this.stats = new StatsCounter(this.imagesPath);
	}

	/**
	 * Resizes an image
	 * @param imagePath Path of the image to resize
	 * @param size the size as string (Ex: "500x400");
	 * @param preserveAspect should the image aspect be preserved ?
	 */
	public resize(imagePath: string, size: string, preserveAspect?: boolean): Promise<Buffer> {
		const ext = path.extname(imagePath);
		// Path of the future resized image , ex: ..\images\IMAGE_620x480.jpg
		const outPath = path.join(path.dirname(imagePath),
			'resized',
			path.basename(imagePath, ext) +
			(size ? '_' + size : '') +
			(preserveAspect ? '_p' : '') +
			ext);
		// Return a promise for the buffer of the image
		return new Promise((resolve, reject) => {
			fs.exists(outPath, (exists) => {
				// if the file was already resized
				if (exists) {
					fs.readFile(outPath, (err, data) => {
						if (err) { reject(err); }
						this.stats.cacheHits++;
						resolve(data);
					});
				} else {
					// read the original file and resize it, then return the resized image.
					this.stats.cacheMisses++;
					fs.readFile(imagePath, (err, data) => {
						if (err) reject(err);
						const [width, height] = size.split('x').map(x => parseInt(x));
						if (isNumeric(width) && isNumeric(height)) {
							const transformer = (
								preserveAspect ?
									sharp(data).resize(width, height) :
									sharp(data).resize(width, height).max()
							);
							transformer.toBuffer()
								.then(resized => fs.writeFile(outPath, resized, (writeErr) => {
									if (writeErr) reject(writeErr);
									resolve(resized);
								}))
								.catch(error => reject(error));
						} else {
							reject('Invalid picture size');
						}
					});
				}
			});
		});
	}
}

function assureCacheDirectoryExistance(directoryPath: string) {
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath);
	}
}

function isNumeric(n: number) {
	return !isNaN(n) && isFinite(n) && n > 0;
}

export default new ImageResizer();
