const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app');
const Quiz = require('../src/models/Quiz');
const Topic = require('../src/models/Topic');
const User = require('../src/models/User');
const QuizScore = require('../src/models/QuizScore');

chai.use(chaiHttp.default || chaiHttp);

describe('Quiz API', () => {
  let sandbox;
  let teacherToken, studentToken;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Mock users for auth middleware
    const teacher = { _id: 'teacher123', role: 'teacher' };
    const student = { _id: 'student123', role: 'student' };
    
    // Stub User.findById to handle different users
    const userStub = sandbox.stub(User, 'findById');
    userStub.withArgs('teacher123').resolves(teacher);
    userStub.withArgs('student123').resolves(student);

    // Mock token verification
    const verifyStub = sandbox.stub(require('../src/services/authService'), 'verifyToken');
    verifyStub.withArgs('fake-teacher-token').returns({ id: 'teacher123' });
    verifyStub.withArgs('fake-student-token').returns({ id: 'student123' });

    teacherToken = 'fake-teacher-token';
    studentToken = 'fake-student-token';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /api/quizzes', () => {
    it('should create a new quiz for a teacher', async () => {
      // Expected result: A new quiz is created and returned with a 201 status.
      const topic = { _id: 'topic123', name: 'Calculus' };
      const quizData = { topic: 'topic123', title: 'New Quiz' };
      
      sandbox.stub(Topic, 'findById').resolves(topic);
      sandbox.stub(Quiz, 'create').resolves({ ...quizData, _id: 'quiz123', createdBy: 'teacher123' });

      const res = await chai
        .request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(quizData);

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('title', 'New Quiz');
    });
  });

  describe('GET /api/topics/:topicId/quizzes', () => {
    it('should return all quizzes for a given topic', async () => {
      // Expected result: API returns a list of quizzes for the specified topic.
      const topicId = 'topic123';
      const quizzes = [
        { _id: 'q1', title: 'Quiz 1', topic: topicId },
        { _id: 'q2', title: 'Quiz 2', topic: topicId }
      ];
      sandbox.stub(Topic, 'findById').resolves({ _id: topicId });
      sandbox.stub(Quiz, 'find').resolves(quizzes);

      const res = await chai.request(app).get(`/api/topics/${topicId}/quizzes`);

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.count).to.equal(2);
    });
  });

  describe('GET /api/quizzes/:quizId/score', () => {
    it('should return the score for a student', async () => {
        // Expected result: API returns the quiz score for the authenticated student.
        const quizId = 'quiz123';
        const score = { _id: 'score123', quiz: quizId, student: 'student123', score: 85 };
        sandbox.stub(QuizScore, 'findOne').resolves(score);

        const res = await chai
            .request(app)
            .get(`/api/quizzes/${quizId}/score`)
            .set('Authorization', `Bearer ${studentToken}`);

        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('score', 85);
    });

    it('should return 404 if no score is found', async () => {
        // Expected result: API returns a 404 error if no score is found for the student.
        const quizId = 'quiz123';
        sandbox.stub(QuizScore, 'findOne').resolves(null);

        const res = await chai
            .request(app)
            .get(`/api/quizzes/${quizId}/score`)
            .set('Authorization', `Bearer ${studentToken}`);

        expect(res).to.have.status(404);
        expect(res.body.success).to.be.false;
    });
  });
});
