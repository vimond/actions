const core = require('@actions/core');

const fs = require('fs');
require('dotenv').config()
const ticketFinder = require('./src/tickets-finder');
const prMetadataCollector = require('./src/pr-metadata-collector');
const jira = require('./src/jira');


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

    const jiraConfig = {
      host: process.env.JIRA_HOST ||  core.getInput("jira-host"),
      proxy: process.env.JIRA_PROXY ||  core.getInput("jira-proxy"),
      username:  process.env.JIRA_USERNAME ||  core.getInput("jira-username"),
      token: process.env.JIRA_TOKEN ||  core.getInput("jira-token")
    }

    let textBlocks = await prMetadataCollector.getAllTextBlocks(input.owner, input.repo, input.prNumber);
    const ticketsFound = Array.from(ticketFinder.findAll(textBlocks));
    console.log(`Tickets found: ${JSON.stringify(ticketsFound)}`);

    const ticketsFiltered =  await jira.checkIfExist(jiraConfig, ticketsFound);
    console.log(`Tickets filtered: ${JSON.stringify(ticketsFiltered)}`);

    if ( input.outputFile !== ""){
      await fs.writeFileSync(input.outputFile,JSON.stringify(ticketsFiltered), { flag: 'w' });
    }

    core.setOutput('tickets', Buffer.from(JSON.stringify(ticketsFiltered)).toString('base64'))
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
