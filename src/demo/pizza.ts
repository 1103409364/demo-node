#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
const program = require("commander");

clear();
console.log(
  chalk.red(figlet.textSync("pizza-cli-2022", { horizontalLayout: "full" }))
);

program
  .version("0.0.3")
  .description("An example CLI for ordering pizza's")
  .option("-p, --peppers", "Add peppers")
  .option("-P, --pineapple", "Add pineapple")
  .option("-b, --bbq", "Add bbq sauce")
  .option("-c, --cheese <type>", "Add the specified type of cheese [marble]")
  .option("-C, --no-cheese", "You do not want any cheese")
  .parse(process.argv);

const options = program.opts();

console.log("you ordered a pizza with:");
if (options.peppers) console.log("  - peppers");
if (options.pineapple) console.log("  - pineapple");
if (options.bbq) console.log("  - bbq");

const cheese: string =
  undefined === options.cheese ? "marble" : options.cheese || "no";

console.log("  - %s cheese", cheese);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
