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
  "What's something unexpected that could happen right now?",
  "Move your characters to a new location",
  "Give a character a wholesome interaction",
  "Give a character a painfully emotional interaction",
  "Expose a character's secret",
  "Remember your oxford commas!",
  "Choose a character; think about what they see, hear, and smell. How can this improve your descriptions?",
  "What is one of your supporting characters feeling right now? Why are they here?",
  "Change the weather",
  "Make a character trip up. What changes?",
  "A character finds £20 in their pocket. What changes?",
  "How would you react in this situation?",
];

const getHint = () => {
  return hints[Math.floor(Math.random() * hints.length)];
};

module.exports = getHint;
