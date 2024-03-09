const chalk = require("chalk");

module.exports = class Logger {
  constructor() {}

  logChat(message, user) {
    console.log(
      chalk.blueBright(`[${new Date().toLocaleTimeString()}] `) +
        chalk.green(`[KICK CHAT] `) +
        chalk.yellowBright(`${user} `) +
        chalk.whiteBright(`: ${message}`)
    );
  }

  logError(message) {
    console.log(
      chalk.blueBright(`[${new Date().toLocaleTimeString()}] `) +
        chalk.red(`[ERROR] `) +
        chalk.whiteBright(`${message}`)
    );
  }

  logInfo(message) {
    console.log(
      chalk.blueBright(`[${new Date().toLocaleTimeString()}] `) +
        chalk.green(`[INFO] `) +
        chalk.whiteBright(`${message}`)
    );
  }
};
