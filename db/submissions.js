const Submission = require("../models/submission");

async function getSubmissions() {
  return await Submission.find();
}

async function getSubmission(id) {
  return await Submission.findOne({ _id: id });
}

async function createSubmission(data) {
  const submission = new Submission({
    title: data.title,
    content: data.content,
  });

  let response = submission;

  await submission.save((error) => {
    response = formatErrors(error);
  });

  return response;
}

const formatErrors = (error) => {
  const fields = ["title", "content"];
  let errorArray = [];

  if (error) {
    fields.forEach((field) => {
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
