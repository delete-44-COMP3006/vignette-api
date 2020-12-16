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

    // Setup test data for the suite
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
    // Destroy all test data
    await Submission.deleteMany();
  });

  it("successfully GETs all submissions", async () => {
    // Make GET index request
    const response = await chai.request(this.app).get(path);

    chai.assert.equal(response.status, 200);
    chai.assert.equal(response.body.length, 2);

    // Confirm all submissions are retrieved
    chai.assert.include(response.text, "Test title 1");
    chai.assert.include(response.text, "Test content 1");
    chai.assert.include(response.text, "Test title 2");
    chai.assert.include(response.text, "Test content 2");
  });

  it("successfully POSTs a new submission", async () => {
    // Add new record
    const response = await chai.request(this.app).post(path).type("form").send({
      title: "Test title 3",
      content: "Test content 3",
    });

    // Confirm record is returned correctly
    chai.assert.equal(response.status, 201);
    chai.assert.equal(response.body.title, "Test title 3");
    chai.assert.equal(response.body.content, "Test content 3");

    // Confirm new record has been added
    const indexResponse = await chai.request(this.app).get(path);

    chai.assert.include(indexResponse.text, "Test title 1");
    chai.assert.include(indexResponse.text, "Test content 1");
    chai.assert.include(indexResponse.text, "Test title 2");
    chai.assert.include(indexResponse.text, "Test content 2");
    chai.assert.include(indexResponse.text, "Test title 3");
    chai.assert.include(indexResponse.text, "Test content 3");
  });

  describe("Testing GET show", () => {
    it("successfully GETs a single submission by ID", async () => {
      // Perform GET request with a set ID
      const response = await chai
        .request(this.app)
        .get(`${path}/${submission_1._id}`);

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 1);

      // Confirm only desired submission is retrieved
      chai.assert.include(response.text, "Test title 1");
      chai.assert.include(response.text, "Test content 1");
      chai.assert.notInclude(response.text, "Test title 2");
      chai.assert.notInclude(response.text, "Test content 2");
    });

    it("returns valid status when given an invalid ID", async () => {
      // Perform GET request with a set ID
      const response = await chai
        .request(this.app)
        .get(`${path}/invalid_id`);

      chai.assert.equal(response.status, 404);
    });
  });
});
