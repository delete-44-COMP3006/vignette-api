const { expect } = require("chai");
const chai = require("chai");
const Submission = require("../models/submission");

describe("Submission model", function () {
  afterEach(async () => {
    // Destroy all test data
    await Submission.deleteMany();
  });

  it("Is correctly saved when attributes are correct", async () => {
    const submission = new Submission({
      title: "Title",
      summary: "Summary",
      content: "Content",
    });

    const error = submission.validateSync();

    chai.assert.isUndefined(error);

    chai.assert.equal(submission.title, "Title");
    chai.assert.equal(submission.content, "Content");
    chai.assert.equal(submission.summary, "Summary");
    chai.assert.equal(submission.award, "none");

    // Confirm default fields are created
    chai.assert.isNotNull(submission._id);
    chai.assert.isNotNull(submission.createdAt);
    chai.assert.isNotNull(submission.updatedAt);
  });

  describe("Title", () => {
    it("is invalid when missing", async () => {
      const submission = new Submission({
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.title.message,
        "Please name your submission"
      );
    });

    it("is invalid when too long", async () => {
      const submission = new Submission({
        title: "T".repeat(101),
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.title.message,
        "Title must be under 100 characters in length"
      );
    });
  });

  describe("Summary", () => {
    it("is valid when missing", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
    });

    it("is invalid when too long", async () => {
      const submission = new Submission({
        title: "Title",
        summary: "S".repeat(301),
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.summary.message,
        "Summary must be under 300 characters in length"
      );
    });
  });

  describe("Content", () => {
    it("is invalid when missing", async () => {
      const submission = new Submission({
        title: "Title",
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.content.message,
        "Please add some content to your submission"
      );
    });

    it("is invalid when greater than 500 word count", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Word ".repeat(500),
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.content.message,
        "Please keep your submission under the 500 word limit"
      );
    });
  });

  describe("Score", () => {
    it("is given a default value when not provided", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
      chai.assert.equal(submission.score, 0);
    });
  });

  describe("Award", () => {
    it("is assigned by default", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
      chai.assert.equal(submission.award, "none");
    });

    it("is invalid when not one of valid enum", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
        award: "Invalid",
      });

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.award.message,
        "`Invalid` is not a valid enum value for path `award`."
      );
    });

    it("is is valid when 'bronze'", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
        award: "bronze",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
      chai.assert.equal(submission.award, "bronze");
    });

    it("is is valid when 'silver'", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
        award: "silver",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
      chai.assert.equal(submission.award, "silver");
    });

    it("is is valid when 'gold'", async () => {
      const submission = new Submission({
        title: "Title",
        content: "Content",
        award: "gold",
      });

      const error = submission.validateSync();

      chai.assert.isUndefined(error);
      chai.assert.equal(submission.award, "gold");
    });
  });
});
