const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please name your submission"],
    maxLength: [100, "Title must be under 100 characters in length"]
  },
  content: {
    type: String,
    required: [true, "Please add some content to your submission"]
  }
});

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
