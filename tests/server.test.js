const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

const Submission = require("../models/submission");

chai.use(chaiHttp);

describe("Server", function () {
  let submission_1, submission_2;
  const path = "/submissions";

  const date1 = new Date();
  const date2 = new Date();
  date2.setDate(new Date().getDate() + 1)

  beforeEach(async () => {
    this.app = app;

    // Setup test data for the suite
    submission_1 = new Submission({
      title: "Test title 1",
      content: "Test content 1",
      createdAt: date1,
      score: 0,
    });

    submission_2 = new Submission({
      title: "Test title 2",
      summary: "Test summary 2",
      content: "Test content 2",
      createdAt: date2,
      score: 1,
    });

    await submission_1.save();
    await submission_2.save();
  });

  afterEach(async () => {
    // Destroy all test data
    await Submission.deleteMany();
  });

  describe("Testing GET index", () => {
    it("successfully GETs all submissions", async () => {
      // Make GET index request
      const response = await chai.request(this.app).get(path);

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 2);

      // Confirm all submissions are retrieved
      chai.assert.include(response.text, "Test title 1");
      chai.assert.include(response.text, "Test content 1");
      chai.assert.include(response.text, date1.toISOString());

      chai.assert.include(response.text, "Test title 2");
      chai.assert.include(response.text, "Test summary 2");
      chai.assert.include(response.text, "Test content 2");
      chai.assert.include(response.text, date2.toISOString());
    });

    it("sorts by score descending by default", async () => {
      // Make GET index request
      const response = await chai.request(this.app).get(path);

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 2);

      // Confirm data is retrieved sorted by score
      chai.assert.equal(response.body[0].title, "Test title 2");
      chai.assert.equal(response.body[0].content, "Test content 2");
      chai.assert.equal(response.body[0].summary, "Test summary 2");
      chai.assert.equal(response.body[0].score, "1");
      chai.assert.equal(response.body[0].createdAt, date2.toISOString());

      chai.assert.equal(response.body[1].title, "Test title 1");
      chai.assert.equal(response.body[1].content, "Test content 1");
      chai.assert.equal(response.body[1].score, "0");
      chai.assert.equal(response.body[1].createdAt, date1.toISOString());
    });

    it("accepts name fields to sort by", async () => {
      // Make GET index request with sort body
      const response = await chai
        .request(this.app)
        .get(path)
        .type("form")
        .query({
          sort: "name"
        });

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 2);

      // Confirm data is retrieved sorted by name
      chai.assert.equal(response.body[0].title, "Test title 1");
      chai.assert.equal(response.body[0].content, "Test content 1");
      chai.assert.equal(response.body[0].score, "0");
      chai.assert.equal(response.body[0].createdAt, date1.toISOString());

      chai.assert.equal(response.body[1].title, "Test title 2");
      chai.assert.equal(response.body[1].content, "Test content 2");
      chai.assert.equal(response.body[1].summary, "Test summary 2");
      chai.assert.equal(response.body[1].score, "1");
      chai.assert.equal(response.body[1].createdAt, date2.toISOString());
    });

    it("accepts createdAt fields to sort by", async () => {
      // Make GET index request with sort body
      const response = await chai
        .request(this.app)
        .get(path)
        .type("form")
        .query({
          sort: "createdAt"
        });

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 2);

      // Confirm data is retrieved sorted by createdAt ascending
      chai.assert.equal(response.body[0].title, "Test title 1");
      chai.assert.equal(response.body[0].content, "Test content 1");
      chai.assert.equal(response.body[0].score, "0");
      chai.assert.equal(response.body[0].createdAt, date1.toISOString());

      chai.assert.equal(response.body[1].title, "Test title 2");
      chai.assert.equal(response.body[1].content, "Test content 2");
      chai.assert.equal(response.body[1].summary, "Test summary 2");
      chai.assert.equal(response.body[1].score, "1");
      chai.assert.equal(response.body[1].createdAt, date2.toISOString());
    });

    it("accepts -createdAt fields to sort by", async () => {
      // Make GET index request with sort body
      const response = await chai
        .request(this.app)
        .get(path)
        .type("form")
        .query({
          sort: "-createdAt"
        });

      chai.assert.equal(response.status, 200);
      chai.assert.equal(response.body.length, 2);

      // Confirm data is retrieved sorted by createdAt descending
      chai.assert.equal(response.body[0].title, "Test title 2");
      chai.assert.equal(response.body[0].content, "Test content 2");
      chai.assert.equal(response.body[0].summary, "Test summary 2");
      chai.assert.equal(response.body[0].score, "1");
      chai.assert.equal(response.body[0].createdAt, date2.toISOString());

      chai.assert.equal(response.body[1].title, "Test title 1");
      chai.assert.equal(response.body[1].content, "Test content 1");
      chai.assert.equal(response.body[1].score, "0");
      chai.assert.equal(response.body[1].createdAt, date1.toISOString());
    });
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
      chai.assert.equal(response.body.createdAt, date1.toISOString());

      chai.assert.notInclude(response.text, "Test title 2");
      chai.assert.notInclude(response.text, "Test summary 2");
      chai.assert.notInclude(response.text, "Test content 2");
      chai.assert.notInclude(response.text, date2.toISOString());
    });

    it("returns valid status when given an invalid ID", async () => {
      // Perform GET request with a set ID
      const response = await chai
        .request(this.app)
        .get(`${path}/507f191e810c19729de860ea`);

      chai.assert.equal(response.status, 404);
    });
  });

  describe("Testing PATCH update", () => {
    describe("without a previous vote", () => {
      const hasVoted = false;

      it("successfully votes up an entry", async () => {
        const currentVote = true;
        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
          });

        // Confirm score has been incremented
        chai.assert.equal(response.body.score, startScore + 1);
        chai.assert.equal(response.body.award, "none")
      });

      it("successfully votes down an entry", async () => {
        const currentVote = false;
        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
          });

        // Confirm score has been decremented
        chai.assert.equal(response.body.score, startScore - 1);
        chai.assert.equal(response.body.award, "none")
      });
    });

    describe("with a previous vote", () => {
      const hasVoted = true;

      it("successfully undoes vote up", async () => {
        const currentVote = true;
        const previousVote = true;

        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
            previousVote: previousVote,
          });

        // Confirm score has been decremented
        chai.assert.equal(response.body.score, startScore - 1);
        chai.assert.equal(response.body.award, "none")
      });

      it("successfully undoes vote down", async () => {
        const currentVote = false;
        const previousVote = false;

        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
            previousVote: previousVote,
          });

        // Confirm score has been incremented
        chai.assert.equal(response.body.score, startScore + 1);
        chai.assert.equal(response.body.award, "none")
      });

      it("successfully replaces vote up with vote down", async () => {
        const currentVote = false;
        const previousVote = true;

        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
            previousVote: previousVote,
          });

        // Confirm score has been decremented twice
        chai.assert.equal(response.body.score, startScore - 2);
        chai.assert.equal(response.body.award, "none")
      });

      it("successfully replaces vote down with vote up", async () => {
        const currentVote = true;
        const previousVote = false;

        const startScore = submission_1.score;

        // Send request
        const response = await chai
          .request(this.app)
          .patch(`${path}/${submission_1._id}`)
          .type("form")
          .send({
            hasVoted: hasVoted,
            currentVote: currentVote,
            previousVote: previousVote,
          });

        // Confirm score has been incremented twice
        chai.assert.equal(response.body.score, startScore + 2);
        chai.assert.equal(response.body.award, "none")
      });

      it("correctly assigns a bronze award", async () => {
        submission_1.score = 49;
        await submission_1.save();

        // Send request
        const response = await chai
        .request(this.app)
        .patch(`${path}/${submission_1._id}`)
        .type("form")
        .send({
          hasVoted: false,
          currentVote: true,
        });

        chai.assert.equal(response.body.award, "bronze")
      });

      it("correctly assigns a silver award", async () => {
        submission_1.score = 99;
        await submission_1.save();

        // Send request
        const response = await chai
        .request(this.app)
        .patch(`${path}/${submission_1._id}`)
        .type("form")
        .send({
          hasVoted: false,
          currentVote: true,
        });

        chai.assert.equal(response.body.award, "silver")
      });

      it("correctly assigns a gold award", async () => {
        submission_1.score = 149;
        await submission_1.save();

        // Send request
        const response = await chai
        .request(this.app)
        .patch(`${path}/${submission_1._id}`)
        .type("form")
        .send({
          hasVoted: false,
          currentVote: true,
        });

        chai.assert.equal(response.body.award, "gold")
      });

      it("correctly removes an award", async () => {
        submission_1.score = 50;
        await submission_1.save();

        // Send request
        const response = await chai
        .request(this.app)
        .patch(`${path}/${submission_1._id}`)
        .type("form")
        .send({
          hasVoted: false,
          currentVote: false,
        });

        chai.assert.equal(response.body.award, "none")
      });
    });
  });
});
