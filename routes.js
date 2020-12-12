let db = require("./db/submissions");
let Submission = require("./models/submission");

async function submissionsIndex(request, response) {
  let submissions = await db.getSubmissions();

  response.json(submissions);
}

async function submissionsShow(request, response) {
  let submission = await db.getSubmission(request.params.id);

  response.json(submission);
}

async function submissionsCreate(request, response) {
  let submission = await db.createSubmission(request.body)

  response.send(submission);
}

module.exports.submissionsIndex = submissionsIndex;
module.exports.submissionsShow = submissionsShow;
module.exports.submissionsCreate = submissionsCreate;
