const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

chai.use(chaiHttp.default || chaiHttp);

global.expect = chai.expect;
global.sinon = sinon;

global.expect = chai.expect;
global.sinon = sinon;
