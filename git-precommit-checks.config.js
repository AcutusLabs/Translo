module.exports = {
  display: {
    notifications: true,
    offendingContent: true,
    rulesSummary: false,
    shortStats: true,
    verbose: false,
  },
  rules: [
    {
      message: 'You’ve got leftover conflict markers',
      regex: /^[<>|=]{4,}/m,
    },
    {
      nonBlocking: true,
      message: 'You have unfinished devs',
      regex: /(?:FIXME|TODO)/g,
    },
    {
      nonBlocking: true,
      message: 'You’ve got leftover `console.log`',
      regex: /console?\.log/g,
    },
  ],
};
