const core = require('@actions/core');
const github = require('@actions/github')
const fs = require('fs');
require('dotenv').config()
const ticketFinder = require('./src/tickets-finder');
const prMetadataCollector = require('./src/pr-metadata-collector');


// most @actions toolkit packages have async methods
async function run() {
  core.debug(github.context.sha);
  try {

    console.log("Enter action log")
    core.debug("Enter action")
    core.setOutput('time', new Date().toTimeString());

    let input = {}
    if ( process.env.RUN_LOCALLY ) {
      input.ghToken = process.env.GH_TOKEN;
      input.outputFile = process.env.OUTPUT_FILE;
      input.owner = 'vimond';
      input.repo = 'testing-terraform-management';
      input.prNumber = 7;
    } else {
      input.outputFile = core.getInput('output-file');
      input.owner = core.getInput("owner");
      input.repo = core.getInput("repository");
      input.prNumber = core.getInput("pr-id");
    }


    let textBlocks = await prMetadataCollector.getAllTextBlocks(input.owner, input.repo, input.prNumber);
    let ticketsFound = ticketFinder.findAll(textBlocks);
    await fs.writeFileSync(input.outputFile,JSON.stringify(Array.from(ticketsFound)), { flag: 'w' });
    console.log(ticketsFound)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
