const core = require('@actions/core');
const github = require('@actions/github')

const fs = require('fs');
require('dotenv').config()
const ticketFinder = require('./src/tickets-finder');
const prMetadataCollector = require('./src/pr-metadata-collector');


// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Start collecting tickets")

    let input = {
      outputFile: process.env.OUTPUT_FILE || core.getInput('output-file'),
      owner: process.env.OWNER || core.getInput("owner"),
      repo: process.env.REPO || core.getInput("repository"),
      prNumber: process.env.PR_ID || core.getInput("pr-id")
    }

    let textBlocks = await prMetadataCollector.getAllTextBlocks(input.owner, input.repo, input.prNumber);
    const ticketsFound = Array.from(ticketFinder.findAll(textBlocks));
    console.log(`Tickets found: ${JSON.stringify(ticketsFound)}`);
    await fs.writeFileSync(input.outputFile,JSON.stringify(ticketsFound), { flag: 'w' });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
