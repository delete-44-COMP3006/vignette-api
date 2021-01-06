// https://www.writingclasses.com/toolbox/articles/12-techniques-for-getting-un-stuck

const hints = [
  "Throw obstacles in your character’s path",
  "Introduce someone new",
  "Unsettle your character",
  "Jump ahead",
  "Consider the weather",
  "Talk about your story to a rubber duck",
  "Consider the current event from another perspective",
  "What's the worst thing that could happen right now? Write it",
]

const getHint = () => {
  return hints[Math.floor(Math.random() * hints.length)];
}

module.exports = getHint;
