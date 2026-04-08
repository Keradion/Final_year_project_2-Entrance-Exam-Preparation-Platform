const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app');
const Answer = require('../src/models/Answer');
const QuizProblem = require('../src/models/QuizProblem');
const QuizScore = require('../src/models/QuizScore');
const User = require('../src/models/User');

chai.use(chaiHttp.default || chaiHttp);

describe('Answer API', () => {
  let sandbox;
  let studentToken;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Mock user for auth middleware
    const student = { _id: 'student123', role: 'student' };
    sandbox.stub(User, 'findById').resolves(student);
    // Mock token verification
    sandbox.stub(require('../src/services/authService'), 'verifyToken').returns({ id: 'student123' });
    studentToken = 'fake-student-token';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /api/answers', () => {
    it('should submit a correct answer for a quiz problem and update the score', async () => {
      // Expected result: The answer is saved as correct, and the quiz score is incremented.
      const quizProblem = {
        _id: 'qp1',
        quiz: 'quiz123',
        correctAnswer: 'A'
      };
      const answerData = {
        questionId: 'qp1',
        questionModel: 'QuizProblem',
        submittedAnswer: 'A'
      };

      sandbox.stub(QuizProblem, 'findById').resolves(quizProblem);
      sandbox.stub(Answer, 'create').resolves({ ...answerData, isCorrect: true });
      sandbox.stub(QuizScore, 'findOneAndUpdate').resolves({ score: 1 });

      const res = await chai
        .request(app)
        .post('/api/answers')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(answerData);

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.isCorrect).to.be.true;
    });

    it('should submit an incorrect answer for a quiz problem', async () => {
        // Expected result: The answer is saved as incorrect, and the score is not incremented.
        const quizProblem = {
          _id: 'qp1',
          quiz: 'quiz123',
          correctAnswer: 'A'
        };
        const answerData = {
          questionId: 'qp1',
          questionModel: 'QuizProblem',
          submittedAnswer: 'B'
        };
  
        sandbox.stub(QuizProblem, 'findById').resolves(quizProblem);
        sandbox.stub(Answer, 'create').resolves({ ...answerData, isCorrect: false });
        const scoreStub = sandbox.stub(QuizScore, 'findOneAndUpdate');
  
        const res = await chai
          .request(app)
          .post('/api/answers')
          .set('Authorization', `Bearer ${studentToken}`)
          .send(answerData);
  
        expect(res).to.have.status(201);
        expect(res.body.isCorrect).to.be.false;
        expect(scoreStub.called).to.be.false; // Ensure score is not updated for incorrect answer
      });

    it('should return 400 for an invalid question model', async () => {
      // Expected result: API returns a 400 error for an invalid question model type.
      const answerData = {
        questionId: 'q1',
        questionModel: 'InvalidModel',
        submittedAnswer: 'A'
      };

      const res = await chai
        .request(app)
        .post('/api/answers')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(answerData);

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Invalid question type');
    });
  });
});
