const db = require("./db/submissions");

async function submissionsIndex(request, response) {
  const submissions = await db.getSubmissions();

  response.json(submissions);
}

async function submissionsShow(request, response) {
  const submission = await db.getSubmission(request.params.id);

  response.status(submission ? 200 : 404).json(submission);
}

async function submissionsCreate(request, response) {
  const submission = await db.createSubmission(request.body);

  response.status(Array.isArray(submission) ? 422 : 201).send(submission);
}

async function submissionsUpdate(request, response) {
  const submission = await db.updateSubmission(request.params.id, request.body);

  response.status(Array.isArray(submission) ? 422 : 201).send(submission);
}

module.exports.submissionsIndex = submissionsIndex;
module.exports.submissionsShow = submissionsShow;
module.exports.submissionsCreate = submissionsCreate;
module.exports.submissionsUpdate = submissionsUpdate;
