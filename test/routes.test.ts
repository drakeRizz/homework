import chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('image-route', () => {
	it('should be an html page with an 404 error message', () => {
		return chai.request(app).get('/image')
			.then(res => {
				expect(res.type).to.eql('text/html');
				expect(res.status).to.eql(404);
				expect(res.text).to.contain('Not Found');
			});
	});
});


describe('base-route', () => {
	it('should return the stats page', () => {
		return chai.request(app).get('/')
			.then(res => {
				expect(res.type).to.eql('text/html');
				expect(res.status).to.eql(200);
				expect(res.text).to.contain('Stats');
			});
	});
});