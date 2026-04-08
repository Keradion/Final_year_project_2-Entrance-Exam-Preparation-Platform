const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app');
const User = require('../src/models/User');
const authService = require('../src/services/authService');

chai.use(chaiHttp.default || chaiHttp);

describe('Auth API', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      // Expected result: A new user is created in the database, and a JWT token is returned.
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      sandbox.stub(User.prototype, 'save').resolves(user);
      sandbox.stub(authService, 'generateToken').returns('test_token');

      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send(user);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.equal('test_token');
    });

    it('should return 400 if user already exists', async () => {
        // Expected result: The API returns a 400 error with a message indicating that the user already exists.
        const user = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        };
        sandbox.stub(User, 'findOne').resolves(user);
  
        const res = await chai
          .request(app)
          .post('/api/auth/register')
          .send(user);
  
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'User already exists');
      });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user and return a token', async () => {
      // Expected result: The user is successfully logged in, and a JWT token is returned.
      const user = {
        email: 'test@example.com',
        password: 'password123',
      };
      const existingUser = {
        ...user,
        comparePassword: () => Promise.resolve(true),
      };
      sandbox.stub(User, 'findOne').resolves(existingUser);
      sandbox.stub(authService, 'generateToken').returns('test_token');

      const res = await chai.request(app).post('/api/auth/login').send(user);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.equal('test_token');
    });

    it('should return 401 for invalid credentials', async () => {
        // Expected result: The API returns a 401 error indicating that the credentials are a match.
        const user = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };
        sandbox.stub(User, 'findOne').resolves(null);
  
        const res = await chai.request(app).post('/api/auth/login').send(user);
  
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'Invalid credentials');
      });
  });
});
