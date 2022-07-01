require('dotenv').config();
const ticketSender = require('./src/tickets-sender');
const core = require('@actions/core');

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Start storing tickets")

    const input = {
      owner: core.getInput("owner", { required: true }),
      repo: core.getInput("repository", { required: true }),
      commitSha: core.getInput("commit-sha", { required: true }),
      tag: core.getInput("tag"),
      branch: core.getInput("branch", { required: true }),
      tickets: core.getInput("tickets")
    };

    const awsConfig = {
      lambdaUrl: core.getInput("lambda-url", { required: true }),
      signingKey: core.getInput("signing-key")
    };

    // Hide secrets
    core.setSecret(awsConfig.signingKey);
    core.setSecret(core.getInput('gh-token'))

    const resp = await ticketSender.send(input, awsConfig);
    console.log(`Tickets sent: ${JSON.stringify(resp)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
