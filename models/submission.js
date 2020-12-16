const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
