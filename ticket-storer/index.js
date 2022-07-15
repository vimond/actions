require('dotenv').config();
const ticketSender = require('./src/dynamodb');
const core = require('@actions/core');
const ticketFinder = require('../ticket-collector/src/tickets-finder');
const prTicketSearcher = require('./src/github');
// const jira = require('./src/jira');

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Start storing tickets");

    const input = {
      owner: core.getInput("owner", { required: true }),
      repo: core.getInput("repository", { required: true }),
      overrideRepo: core.getInput("override-repository", { required: false }),
      refName: core.getInput("ref-name", { required: true }),
      refType: core.getInput("ref-type", { required: true }),
      refBase: core.getInput("ref-base", { required: false }),
      previousSha: core.getInput("previous-sha", { required: true }),
      newSha: core.getInput("new-sha", { required: true }),
      commits: JSON.parse(core.getInput("commits", { required: true }))
    };

    const awsConfig = {
      tableName: core.getInput("dynamodb-tablename", { required: true }),
    };

    // These should be required when everything is properly configured
    const jiraConfig = {
      host: core.getInput("jira-host"),
      proxy: core.getInput("jira-proxy"),
      username: core.getInput("jira-username"),
      token: core.getInput("jira-token")
    };

    // Hide secrets
    core.setSecret(jiraConfig.token);
    core.setSecret(jiraConfig.username);
    core.setSecret(core.getInput('gh-token', { required: true }));

    if (input.overrideRepo != undefined && input.overrideRepo !== "") {
      const resp = await ticketSender.storeOverrideRepoName(awsConfig, input.owner, input.repo, input.overrideRepo);
      console.log("Storing overriden repo name", resp);
      input.repo = input.overrideRepo;
    }

    const searchClient = prTicketSearcher.getSearchClient();

    let commitTickets = {};
    let allTickets = [];
    let validTickets = {};
    for (const commit of input.commits) {
      let texts = await prTicketSearcher.searchForCommitPullRequest(searchClient, commit.id);
      texts.push(commit.message);
      const tickets = ticketFinder.findAll(texts);
      commitTickets[commit.id] = tickets;
      allTickets = allTickets.concat([...tickets]);
    }

    console.log("allTickets", allTickets)
    // const filteredTickets = await jira.checkIfExist(jiraConfig, allTickets);
    // if (filteredTickets == null || typeof filteredTickets[Symbol.iterator] !== 'function') {
    //   console.log(filteredTickets);
    //   core.setFailed("Bad response from JIRA");
    //   return;
    // }

    for (const ticket of allTickets) { // TODO: validate, use filteredTickets
      validTickets[ticket] = true;
    }

    let commits = [];
    let parentSha = input.previousSha;
    for (const commit of input.commits) {
      let tickets = [];
      for (const ticket of commitTickets[commit.id]) {
        if (ticket in validTickets) {
          tickets.push(ticket);
        }
      }

      commits.push({
        ownerRepo: input.owner + ":" + input.repo,
        commitSha: commit.id,
        parentSha: parentSha,
        branch: input.refName,
        tickets: tickets
      });
      parentSha = commit.id;
    }


    const resp = await ticketSender.storeCommits(awsConfig, commits);
    console.log(`Tickets sent: ${JSON.stringify(resp)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
