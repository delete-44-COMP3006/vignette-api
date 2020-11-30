let db = require("./db/submissions");

async function submissionsIndex(request, response) {
  let submissions = await db.getSubmissions();
  response.setHeader("content-type", "text/json");

  response.json({
    "submissions": submissions
  });
}

module.exports.submissionsIndex = submissionsIndex;
