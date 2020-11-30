let mongoose = require("mongoose");

let submissionSchema = new mongoose.Schema({
  title: String,
  content: String
});

let Submission = mongoose.model("submission", submissionSchema);
module.exports.Submission = Submission;
