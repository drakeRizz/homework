import chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/app';
import ImageResizer from '../src/misc/image_resizer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

chai.use(chaiHttp);

const expect = chai.expect;
const image_resizer = new ImageResizer();

var image: Buffer;

before(function () {
	this.timeout(0);
	//	Grab a random image from the internet
	return chai.request('https://picsum.photos')
		.get('/1024')
		.then(response => {
			image = response.body;
			fs.writeFileSync(path.join(image_resizer.images_path, 'test.jpg'), image);
		})
})

describe('Image resizer', () => {

	it('should return the resized image at 500x500', () => {
		let size = '500x500';
		return chai.request(app).get(`/image/test.jpg?size=${size}`)
			.then(res => {
				expect(res.status).to.eql(200);
				expect(res.type).to.eql('image/jpg');
				expect(typeof (res.body)).to.equal('object', `Expected type of response body to be an object, but was ${typeof (res.body)}`);
				sharp(res.body).metadata().then(info => {
					let [width, height] = size.split('x').map(x => parseInt(x));
					expect(info.width).to.equal(width, `Expected width to be ${width} but was ${info.width}`);
					expect(info.height).to.equal(height, `Expected height to be ${height} but was ${info.height}`);
				})
			});
	});

	it('should return the original image', () => {
		return chai.request(app).get(`/image/test.jpg`)
			.then(res => {
				expect(res.status).to.eql(200);
				expect(res.type).to.eql('image/jpg');
				expect(typeof (res.body)).to.equal('object', `Expected type of response body to be an object, but was ${typeof (res.body)}`);
				sharp(image).metadata().then(original_image_info => {
					let { width, height, format } = original_image_info;
					sharp(res.body).metadata().then(new_image_info => {
						expect(new_image_info.width).to.equal(width, `Expected width to be ${width} but was ${new_image_info.width}`);
						expect(new_image_info.height).to.equal(height, `Expected height to be ${height} but was ${new_image_info.height}`);
						expect(new_image_info.format).to.equal(format, `Expected height to be ${format} but was ${new_image_info.format}`);
					})
				})

			});
	});

	it('should resize an image', async () => {
		return chai.request(app).get('/')
			.then(res => {
				expect(res.status).to.eql(200);
				expect(res.text).to.contain('Welcome');
			});
	});

});
