let db = require("./db/submissions");

async function submissionsIndex(request, response) {
  let submissions = await db.getSubmissions();
  response.setHeader("content-type", "application/json");

  response.end(JSON.stringify(submissions));
}

module.exports.submissionsIndex = submissionsIndex;
