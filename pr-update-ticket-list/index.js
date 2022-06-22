const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const prUpdater = require('./src/pr-updater')()


require('dotenv').config()
// most @actions toolkit packages have async methods
async function run() {
  core.debug(github.context.sha);
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
      input.tickets = readInputFile(input.inputFile);
    } else {
      input.tickets = Buffer.from(input.tickets, 'base64').toString('utf-8');
    }
    const parsedTickets = JSON.parse(input.tickets);
    console.log(`Input file: ${input.inputFile}`);
    console.log(`Pull Requests ID: ${input.prId}`);
    console.log(`Tickets: ${input.tickets}`)
    console.log(`Ticket count: ${parsedTickets.length}`)



    console.log(parsedTickets);
    const table = prUpdater.generateJiraTable(parsedTickets)
    console.log(table);

    if(input.dryRun) {
      console.log("Dry run. Exiting");
      return;
    }

    const octokit = github.getOctokit(input.githubToken);
    const thePr = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: input.prId,
    })
    console.log(thePr);
    const oldBody = thePr.data.body;

    const newBody = prUpdater.replaceOrAddMarkedArea(thePr.data.body, table);
    if (oldBody !== newBody) {
      console.log("We did some updated. Save.")
      await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: input.prId,
        body: newBody,
      })
    } else {
      console.log("No changes");
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
