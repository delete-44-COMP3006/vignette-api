let db = require("./db/submissions");

async function submissionsIndex(request, response) {
  let submissions = await db.getSubmissions();

  response.json(submissions);
}

module.exports.submissionsIndex = submissionsIndex;
