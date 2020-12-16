const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

const Submission = require("../models/submission");

chai.use(chaiHttp);

describe("Test server", function () {
  let submission_1, submission_2;
  const path = "/submissions";

  beforeEach(async () => {
    this.app = app;

    submission_1 = new Submission({
      title: "Test title 1",
      content: "Test content 1",
    });

    submission_2 = new Submission({
      title: "Test title 2",
      content: "Test content 2",
    });

    await submission_1.save();
    await submission_2.save();
  });

  afterEach(async () => {
    await Submission.deleteMany();
  });

  it("successfully GETs all submissions", async () => {
    const response = await chai.request(this.app).get(path);

    chai.assert.equal(response.status, 200);
    chai.assert.equal(response.body.length, 2);

    chai.assert.include(response.text, "Test title 1");
    chai.assert.include(response.text, "Test content 1");
    chai.assert.include(response.text, "Test title 2");
    chai.assert.include(response.text, "Test content 2");
  });

  it("successfully GETs a single submission by ID", async () => {
    const response = await chai
      .request(this.app)
      .get(`${path}/${submission_1._id}`);

    chai.assert.equal(response.status, 200);
    chai.assert.equal(response.body.length, 1);

    chai.assert.include(response.text, "Test title 1");
    chai.assert.include(response.text, "Test content 1");
    chai.assert.notInclude(response.text, "Test title 2");
    chai.assert.notInclude(response.text, "Test content 2");
  });
});
