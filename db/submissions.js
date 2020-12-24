const Submission = require("../models/submission");
const permittedParams = ["title", "summary", "content"];

async function getSubmissions() {
  return await Submission.find();
}

async function getSubmission(id) {
  return await Submission.findOne({ _id: id });
}

async function createSubmission(data) {
  const submission = new Submission(data);

  let response = submission;

  await submission.save((error) => {
    response = formatErrors(error);
  });

  return response;
}

const formatErrors = (error) => {
  let errorArray = [];

  if (error) {
    permittedParams.forEach((field) => {
      if (error.errors[field]) {
        errorArray.push(error.errors[field].message);
      }
    });
  }

  return errorArray;
};

module.exports.getSubmissions = getSubmissions;
module.exports.getSubmission = getSubmission;
module.exports.createSubmission = createSubmission;
