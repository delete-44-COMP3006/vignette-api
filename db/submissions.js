const Submission = require("../models/submission");
const permittedParams = ["title", "summary", "content"];

async function getSubmissions() {
  return await Submission.find();
}

async function getSubmission(id) {
  return await Submission.findById(id)
}

async function createSubmission(data) {
  const submission = new Submission(data);

  let response = submission;

  await submission.save((error) => {
    response = formatErrors(error);
  });

  return response;
}

async function updateSubmission(id, data) {
  // Retrieve booleans from request to determine what change was made
  let hasVoted = data["hasVoted"] === "true";
  let previousVote = data["previousVote"] === "true";
  let currentVote = data["currentVote"] === "true";

  // The value to change the submissions score by
  let scoreChange = 0;

  if (!hasVoted) {
    // If haven't voted previously, add new vote
    currentVote ? (scoreChange = 1) : (scoreChange = -1);
  } else if (previousVote === currentVote) {
    // If voted previously and votes match, undo vote
    currentVote ? (scoreChange = -1) : (scoreChange = 1);
  } else if (previousVote && !currentVote) {
    // If switching from +ve vote to -ve vote, remove vote and add new -ve vote
    scoreChange = -2;
  } else if (!previousVote && currentVote) {
    // If switching from -ve to +ve vote, remove vote and add new +ve vote
    scoreChange = 2;
  }

  const submission = await Submission.findById(id);
  submission.score = submission.score + scoreChange;

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
module.exports.updateSubmission = updateSubmission;
