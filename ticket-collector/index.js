const core = require('@actions/core');

const fs = require('fs');
require('dotenv').config();
const ticketFinder = require('../utils/tickets-finder');
const prMetadataCollector = require('./src/pr-metadata-collector');
const jira = require('../utils/jira');


// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Start collecting tickets")

    let input = {
      outputFile: core.getInput('output-file'),
      owner: core.getInput("owner"),
      repo: core.getInput("repository"),
      prNumber: core.getInput("pr-id")
    }

    const jiraConfig = {
      host: core.getInput("jira-host"),
      proxy: core.getInput("jira-proxy"),
      username: core.getInput("jira-username"),
      token: core.getInput("jira-token")
    }

    // Hide secrets
    core.setSecret(jiraConfig.token);
    core.setSecret(jiraConfig.username);
    core.setSecret(core.getInput('gh-token'))

    let textBlocks = await prMetadataCollector.getAllTextBlocks(input.owner, input.repo, input.prNumber);
    const ticketsFound = Array.from(ticketFinder.findAll(textBlocks));
    console.log(`Tickets found: ${JSON.stringify(ticketsFound)}`);

    const ticketsFiltered = await jira.checkIfExist(jiraConfig, ticketsFound);
    console.log(`Tickets filtered: ${JSON.stringify(ticketsFiltered)}`);



    if (input.outputFile !== "") {
      await fs.writeFileSync(input.outputFile, JSON.stringify(ticketsFiltered), { flag: 'w' });
    }
    core.setOutput('tickets', Buffer.from(JSON.stringify(ticketsFiltered)).toString('base64'))

    if (ticketsFiltered.length === 0) {
      core.setFailed('No valid tickets were found in this pull request');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
