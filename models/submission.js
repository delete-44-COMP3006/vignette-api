const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please name your submission"],
    maxlength: [100, "Title must be under 100 characters in length"],
  },
  summary: {
    type: String,
    maxlength: [300, "Summary must be under 300 characters in length"],
  },
  content: {
    type: String,
    required: [true, "Please add some content to your submission"],
    validate: {
      validator: function (v) {
        return v.trim().replace(/\s+/gi, " ").split(" ").length < 500;
      },
      message: "Please keep your submission under the 500 word limit",
    },
  },
  score: {
    type: Number,
    default: 0,
  },
});

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
