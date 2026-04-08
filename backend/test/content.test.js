const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app');
const Subject = require('../src/models/Subject');
const Topic = require('../src/models/Topic');

chai.use(chaiHttp.default || chaiHttp);

describe('Content API', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/subjects', () => {
    it('should return a list of subjects', async () => {
      // Expected result: The API returns a 200 status code and a list of subjects.
      const subjects = [{ name: 'Math' }, { name: 'Science' }];
      sandbox.stub(Subject, 'find').resolves(subjects);

      const res = await chai.request(app).get('/api/subjects');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });
  });

  describe('GET /api/subjects/:subjectId/topics', () => {
    it('should return a list of topics for a subject', async () => {
      // Expected result: The API returns a 200 status code and a list of topics for the given subject.
      const topics = [{ name: 'Algebra' }, { name: 'Geometry' }];
      sandbox.stub(Topic, 'find').resolves(topics);

      const res = await chai.request(app).get('/api/subjects/123/topics');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });

    it('should return 404 if subject not found', async () => {
        // Expected result: The API returns a 404 error when the requested subject does not exist.
        sandbox.stub(Topic, 'find').resolves([]);
  
        const res = await chai.request(app).get('/api/subjects/123/topics');
  
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'No topics found for this subject');
      });
  });
});
