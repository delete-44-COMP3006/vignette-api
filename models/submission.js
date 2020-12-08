var mongoose = require('mongoose');

var submissionSchema = new mongoose.Schema({
  title: String,
  content: String,
});

let Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
