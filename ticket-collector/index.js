const core = require('@actions/core');

const fs = require('fs');
require('dotenv').config();
const ticketFinder = require('../utils/tickets-finder');
const prMetadataCollector = require('./src/pr-metadata-collector');
const jira = require('../utils/jira');
const nodeFetch = require('node-fetch');


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
    core.setSecret(core.getInput('gh-token'));

    let textBlocks = await prMetadataCollector.getAllTextBlocks(input.owner, input.repo, input.prNumber);
    const ticketsFound = Array.from(ticketFinder.findAll(textBlocks));
    console.log(`Tickets found: ${JSON.stringify(ticketsFound)}`);

    let filteredTickets;
    if (jiraConfig.host !== undefined && jiraConfig.token !== undefined && jiraConfig.username !== undefined) {
      try {
        filteredTickets = await jira.checkIfExist(nodeFetch, jiraConfig, ticketsFound);
        if (filteredTickets == null || typeof filteredTickets[Symbol.iterator] !== 'function') {
          console.log(`Bad response from JIRA: ${filteredTickets}`);
          filteredTickets = formatMissingTickets(ticketsFound);
        }
        console.log(`Finished ticket validation: ${JSON.stringify(filteredTickets)}`);
      } catch (e) {
        console.log(`error validating JIRA tickets, skipping: ${e}`);
        filteredTickets = formatMissingTickets(ticketsFound);
      }
    } else {
      filteredTickets = formatMissingTickets(ticketsFound);
      console.log("jira config not provided, skipping validation")
    }


    if (input.outputFile !== "") {
      await fs.writeFileSync(input.outputFile, JSON.stringify(filteredTickets), { flag: 'w' });
    }
    core.setOutput('tickets', Buffer.from(JSON.stringify(filteredTickets)).toString('base64'))

    if (filteredTickets.length === 0) {
      core.setFailed('No valid tickets were found in this pull request');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function formatMissingTickets(tickets) {
  return tickets.map(t => (
    {
      "key": t,
      "link": `https://vimond-ng.atlassian.net/browse/${t}`,
      "summary": "Missing"
    }
  ));
}

run();
