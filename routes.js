let db = require("./db/submissions");

async function submissionsIndex(request, response) {
  let submissions = await db.getSubmissions();

  response.json(submissions);
}

async function submissionsShow(request, response) {
  let submission = await db.getSubmission(request.params.id);

  response.json(submission);
}

module.exports.submissionsIndex = submissionsIndex;
module.exports.submissionsShow = submissionsShow;
