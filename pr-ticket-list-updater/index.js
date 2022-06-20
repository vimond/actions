const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const pr = require('./src/pr')


require('dotenv').config()
// most @actions toolkit packages have async methods
async function run() {
  core.debug(github.context.sha);
  try {
    let input = {
      tickets: process.env.TICKETS || core.getInput("tickets"),
      inputFile: process.env.INPUT_FILE || core.getInput("input-file"),
      prId:  process.env.PR_ID || core.getInput("pr-id"),
      dryRun: process.env.DRY_RUN || core.getBooleanInput("dry-run"),
    }

    if (input.tickets === "") {
      input.tickets = readInputFile(input.inputFile);
    } else {
      input.tickets = Buffer.from(input.tickets, 'base64').toString('utf-8');
    }
    const parsedTickets = JSON.parse(input.tickets);
    console.log(`Input file: ${input.inputFile}`);
    console.log(`Pull Requests ID: ${input.prId}`);
    console.log(`Tickets: ${input.tickets}`)
    console.log(`Ticket count: ${parsedTickets.length}`)



    const table = pr.generateJiraTable(parsedTickets)
    console.log(table);

    if(input.dryRun) {
      console.log("Dry run. Exiting");
      return;
    }
    console.log("doing stuff...");
  } catch (error) {
    core.setFailed(error.message);
  }
}

function readInputFile(path) {
  console.log(`Trying to read tickets from ${path}`);
  return fs.readFileSync(path, {encoding: 'base64'});
}

run();
