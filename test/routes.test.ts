import chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('base-route', () => {
	it('should be an html page with an welcome message', () => {
		return chai.request(app).get('/')
			.then(res => {
				expect(res.type).to.eql('text/html');
				expect(res.status).to.eql(200);
				expect(res.text).to.contain('Welcome');
			});
	});
});


describe('image-route', () => {
	it('should return the stats page', () => {
		return chai.request(app).get('/image')
			.then(res => {
				expect(res.type).to.eql('text/html');
				expect(res.status).to.eql(200);
				expect(res.text).to.contain('Stats');
			});
	});
});