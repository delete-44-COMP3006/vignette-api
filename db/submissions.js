let Submission = require("../models/submission");

async function getSubmissions() {
  return await Submission.find();
}

async function getSubmission(id) {
  return await Submission.find({_id: id})
}

module.exports.getSubmissions = getSubmissions;
module.exports.getSubmission = getSubmission;
