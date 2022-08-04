const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const prUpdater = require('./src/pr-updater')()


require('dotenv').config()
// most @actions toolkit packages have async methods
async function run() {
  try {
    let input = {
      tickets: core.getInput("tickets"),
      inputFile: core.getInput("input-file"),
      prId: core.getInput("pr-id", {required: true}),
      dryRun: core.getBooleanInput("dry-run"),
      githubToken: core.getInput("gh-token")
    }
    core.setSecret(input.githubToken);

    if (input.tickets === "") {
      input.tickets = readTicketFile(input.inputFile);
    } else {
      input.tickets = convertTicketInput(input.tickets);
    }
    const parsedTickets = JSON.parse(input.tickets);

    console.log(`Input file: ${input.inputFile}`);
    console.log(`Pull Requests ID: ${input.prId}`);
    console.log(`Tickets: ${parsedTickets.map(t => t.key)}`)

    if(input.dryRun) {
      console.log("Dry run. Exiting");
      return;
    }
    const octokit = github.getOctokit(input.githubToken);
    await prUpdater.updatePr(octokit, input.prId, parsedTickets, github.context.repo);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function readTicketFile(path) {
  console.log(`Trying to read tickets from ${path}`);
  return fs.readFileSync(path, {encoding: 'base64'});
}

function convertTicketInput(inputValue) {
  return Buffer.from(inputValue, 'base64').toString('utf-8');
}

run();
// a
