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
      content: "Content",
    });

    const error = submission.validateSync();

    chai.assert.isUndefined(error);

    chai.assert.equal(submission.title, "Title");
    chai.assert.equal(submission.content, "Content");
    chai.assert.isNotNull(submission._id);
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
      console.log(submission.title.length)

      const error = submission.validateSync();

      chai.assert.equal(
        error.errors.title.message,
        "Title must be under 100 characters in length"
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
});
