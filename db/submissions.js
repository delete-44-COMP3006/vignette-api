let models = require("../models/submission");

async function getSubmissions() {
  return await models.Submission.find();
}

async function getSubmission(id) {
  return await models.Submission.find({_id: id})
}

module.exports.getSubmissions = getSubmissions;
module.exports.getSubmission = getSubmission;
