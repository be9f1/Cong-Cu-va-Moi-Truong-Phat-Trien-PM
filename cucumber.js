let common = [
  'features/**/*.feature',                // Specify our feature files
  '--require-module ts-node/register',    // Load TypeScript module
  '--require features/step_definitions/*.ts',  // Load step definitions
  '--format progress-bar',                // Load progress-bar formatter
].join(' ');

module.exports = {
  default: common
  //
};