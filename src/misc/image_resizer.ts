import process from 'process';
import sharp from 'sharp';
import path from 'path';
import StatsCounter from './stats_counter';
import fs from 'fs';

class ImageResizer {

    public images_path = process.env.IMAGES_PATH || process.cwd() + '\\images';
    public stats: StatsCounter;

    constructor() {
        this.stats = new StatsCounter();
        assureCacheDirectoryExistance(this.images_path + '\\resized');
    }

    /**
    * Resizes an image
    * @param image_path Path of the image to resize
    * @param size the size as string (Ex: "500x400");
    * @param preserve_aspect 
    */
    resize(image_path: string, size?: string, preserve_aspect?: boolean): Promise<Buffer> {
        let ext = path.extname(image_path);
        let out_path = path.dirname(image_path) + '\\resized\\' + path.basename(image_path, ext) + (size ? '_' + size : '') + (preserve_aspect ? '_p' : '') + ext;
        // Return a promise for the buffer of the image
        return new Promise((resolve, reject) => {
            fs.exists(out_path, (exists) => {
                // if the file was already resized
                console.log(out_path);
                if (exists) {
                    fs.readFile(out_path, (err, data) => {
                        if (err) reject(err);
                        this.stats.cache_hits++;
                        resolve(data);
                    })
                } else {
                    //read the original file and resize it, then return the resized image.
                    this.stats.cache_misses++;
                    fs.readFile(image_path, (err, data) => {
                        if (err) reject(err);
                        if (size) {
                            let [width, height] = size.split('x').map(x => parseInt(x));
                            if (isNumeric(width) && isNumeric(height)) {
                                let transformer = (preserve_aspect ? sharp(data).resize(width, height) : sharp(data).resize(width, height).max());
                                transformer.toBuffer()
                                    .then(resized => fs.writeFile(out_path, resized, (err) => {
                                        if (err) reject(err);
                                        resolve(resized);
                                    }))
                                    .catch(err => reject(err));
                            } else {
                                reject('Invalid picture size');
                            }
                        }
                    });
                }
            });
        });
    }
}
function assureCacheDirectoryExistance(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function isNumeric(n: number) {
    return !isNaN(n) && isFinite(n);
}

export default ImageResizer;