const { expect } = require("chai");
const chai = require("chai");
const Submission = require("../models/submission");

describe("Submission model", function () {
  afterEach(async () => {
    // Destroy all test data
    await Submission.deleteMany();
  });

  it("Is correctly saved when attributes are correct", async () => {
    let submission = new Submission({
      title: "Title",
      content: "Content",
    });

    submission.save().then((s) => {
      chai.assert.equal(s.title, "Title")
      chai.assert.equal(s.content, "Content")
    });
  });

  describe("Title", () => {
    it("is invalid when missing", async () => {
      let submission = new Submission({
        content: "Content",
      });

      submission.save().catch((e) => {
        chai.assert.equal(e.errors.title.message, "Please name your submission")
      });
    });

    it("is invalid when too long", async () => {
      let submission = new Submission({
        title: "T".repeat(101),
        content: "Content",
      });

      submission.save().catch((e) => {
        chai.assert.equal(e.errors.title.message, "Title must be under 100 characters in length")
      });
    });
  })
});
