const chalk = require('chalk');

module.exports = function logIt(value, isError = false) {
  console.log(chalk.green("--> " + value));
};