const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

const Submission = require("../models/submission");

chai.use(chaiHttp);

describe("Server", function () {
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
      summary: "Test summary 2",
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
    chai.assert.include(response.text, "Test summary 2");
    chai.assert.include(response.text, "Test content 2");
  });

  describe("Testing POST create", () => {
    it("successfully creates when params are valid", async () => {
      const initialCount = (await Submission.find()).length;

      // Add new record
      const response = await chai
        .request(this.app)
        .post(path)
        .type("form")
        .send({
          title: "Test title 3",
          summary: "Test summary 3",
          content: "Test content 3",
        });

      // Confirm record is returned correctly
      chai.assert.equal(response.status, 201);
      chai.assert.equal(response.body.title, "Test title 3");
      chai.assert.equal(response.body.summary, "Test summary 3");
      chai.assert.equal(response.body.content, "Test content 3");

      // Confirm new record is added correctly
      chai.assert.equal(initialCount + 1, (await Submission.find()).length);

      // Confirm new record has been added
      const indexResponse = await chai.request(this.app).get(path);

      chai.assert.include(indexResponse.text, "Test title 1");
      chai.assert.include(indexResponse.text, "Test content 1");
      chai.assert.include(indexResponse.text, "Test title 2");
      chai.assert.include(indexResponse.text, "Test summary 2");
      chai.assert.include(indexResponse.text, "Test content 2");
      chai.assert.include(indexResponse.text, "Test title 3");
      chai.assert.include(indexResponse.text, "Test summary 3");
      chai.assert.include(indexResponse.text, "Test content 3");
    });

    it("returns an error when one param is incorrect", async () => {
      const initialCount = (await Submission.find()).length;

      // Add invalid record
      const response = await chai
        .request(this.app)
        .post(path)
        .type("form")
        .send({
          title: "Test title",
        });

      // Confirm error is returned correctly
      chai.assert.equal(response.status, 422);
      chai.assert.equal(response.body.length, 1);
      chai.assert.equal(
        response.body[0],
        "Please add some content to your submission"
      );

      // Confirm no new records are added
      chai.assert.equal(initialCount, (await Submission.find()).length);
    });

    it("returns multiple errors when multiple params are incorrect", async () => {
      const initialCount = (await Submission.find()).length;

      // Add invalid record
      const response = await chai
        .request(this.app)
        .post(path)
        .type("form")
        .send({ summary: "S".repeat(301) });

      // Confirm array of errors is returned correctly
      chai.assert.equal(response.status, 422);
      chai.assert.equal(response.body.length, 3);
      chai.assert.includeDeepMembers(response.body, [
        "Please name your submission",
        "Please add some content to your submission",
        "Summary must be under 300 characters in length",
      ]);

      // Confirm no new records are added
      chai.assert.equal(initialCount, (await Submission.find()).length);
    });

    it("ignores invalid params", async () => {
      const initialCount = (await Submission.find()).length;

      // Add new record
      const response = await chai
        .request(this.app)
        .post(path)
        .type("form")
        .send({
          title: "Test title 3",
          summary: "Test summary 3",
          content: "Test content 3",
          invalidParam: "Unpermitted!",
        });

      // Confirm record is returned correctly
      chai.assert.equal(response.status, 201);
      chai.assert.equal(response.body.title, "Test title 3");
      chai.assert.equal(response.body.summary, "Test summary 3");
      chai.assert.equal(response.body.content, "Test content 3");
      chai.assert.notInclude(response.text, "Unpermitted!");

      // Confirm new record is added correctly
      chai.assert.equal(initialCount + 1, (await Submission.find()).length);
    });
  });

  describe("Testing GET show", () => {
    it("successfully GETs a single submission by ID", async () => {
      // Perform GET request with a set ID
      const response = await chai
        .request(this.app)
        .get(`${path}/${submission_1._id}`);

      chai.assert.equal(response.status, 200);

      // Confirm only desired submission is retrieved
      chai.assert.equal(response.body.title, "Test title 1");
      chai.assert.equal(response.body.content, "Test content 1");
      chai.assert.notInclude(response.text, "Test title 2");
      chai.assert.notInclude(response.text, "Test summary 2");
      chai.assert.notInclude(response.text, "Test content 2");
    });

    it("returns valid status when given an invalid ID", async () => {
      // Perform GET request with a set ID
      const response = await chai
        .request(this.app)
        .get(`${path}/507f191e810c19729de860ea`);

      chai.assert.equal(response.status, 404);
    });
  });
});
