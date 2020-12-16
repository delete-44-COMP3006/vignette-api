let Submission = require("../models/submission");

async function getSubmissions() {
  return await Submission.find();
}

async function getSubmission(id) {
  return await Submission.find({ _id: id });
}

async function createSubmission(data) {
  const submission = new Submission({
    title: data.title,
    content: data.content,
  });

  await submission.save();
  return submission;
}

module.exports.getSubmissions = getSubmissions;
module.exports.getSubmission = getSubmission;
module.exports.createSubmission = createSubmission;
