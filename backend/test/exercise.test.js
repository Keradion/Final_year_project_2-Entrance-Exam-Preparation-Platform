const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app'); // Assuming app is exported from app.js
const Exercise = require('../src/models/Exercise');
const Topic = require('../src/models/Topic');
const User = require('../src/models/User');

chai.use(chaiHttp.default || chaiHttp);

describe('Exercise API', () => {
  let sandbox;
  let teacherToken;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Mock user for auth middleware
    const teacher = { _id: 'teacher123', role: 'teacher' };
    sandbox.stub(User, 'findById').resolves(teacher);
    // Mock token verification
    sandbox.stub(require('../src/services/authService'), 'verifyToken').returns({ id: 'teacher123' });
    teacherToken = 'fake-teacher-token';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /api/exercises', () => {
    it('should create a new exercise for a teacher', async () => {
      // Expected result: A new exercise is created and returned with a 201 status.
      const topic = { _id: 'topic123', name: 'Algebra' };
      const exerciseData = { topic: 'topic123', title: 'New Exercise' };
      
      sandbox.stub(Topic, 'findById').resolves(topic);
      sandbox.stub(Exercise, 'create').resolves({ ...exerciseData, _id: 'exercise123', createdBy: 'teacher123' });

      const res = await chai
        .request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(exerciseData);

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('title', 'New Exercise');
    });

    it('should return 404 if topic does not exist', async () => {
        // Expected result: API returns a 404 error if the topic is not found.
        const exerciseData = { topic: 'nonexistenttopic', title: 'New Exercise' };
        sandbox.stub(Topic, 'findById').resolves(null);
  
        const res = await chai
          .request(app)
          .post('/api/exercises')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send(exerciseData);
  
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.false;
      });
  });

  describe('GET /api/topics/:topicId/exercises', () => {
    it('should return all exercises for a given topic', async () => {
      // Expected result: API returns a list of exercises for the specified topic.
      const topicId = 'topic123';
      const exercises = [
        { _id: 'ex1', title: 'Exercise 1', topic: topicId },
        { _id: 'ex2', title: 'Exercise 2', topic: topicId }
      ];
      sandbox.stub(Topic, 'findById').resolves({ _id: topicId });
      sandbox.stub(Exercise, 'find').resolves(exercises);

      const res = await chai.request(app).get(`/api/topics/${topicId}/exercises`);

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.count).to.equal(2);
      expect(res.body.data).to.be.an('array');
    });
  });
});
