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

  // TODO: Figure out how to return errors
  let response = submission;

  await submission.save(function(err) {
    if (err !== null) {
      response = []
      err.errors.forEach(e => {
        response.push(e.message)
      });
      console.log(response)
    }
  })

  return response;
}

module.exports.getSubmissions = getSubmissions;
module.exports.getSubmission = getSubmission;
module.exports.createSubmission = createSubmission;
