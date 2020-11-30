let models = require("../models/submission");

async function getSubmissions() {
  return await models.Submission.find();
}

module.exports.getSubmissions = getSubmissions;
