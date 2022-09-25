import { argv, argv0 } from "process";

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

console.log(argv0);
