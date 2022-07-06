require('dotenv').config();
const ticketSender = require('./src/dynamodb');
const core = require('@actions/core');

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("Start storing tickets")

    const input = {
      owner: core.getInput("owner", { required: true }),
      repo: core.getInput("repository", { required: true }),
      commitSha: core.getInput("commit-sha", { required: true }),
      parentSha: core.getInput("parent-sha", { required: true }),
      tag: core.getInput("tag"),
      branch: core.getInput("branch", { required: true }),
      tickets: core.getInput("tickets"),
      createdAt: core.getInput("created-at", { required: true })
    };

    const awsConfig = {
      creds: core.getInput("aws-credentials", { required: true }),
      region: core.getInput("aws-region", { required: true }),
      tableName: core.getInput("dynamodb-tablename", { required: true }),
    };

    // Hide secrets
    core.setSecret(awsConfig.creds);

    const resp = await ticketSender.send(input, awsConfig);
    console.log(`Tickets sent: ${JSON.stringify(resp)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
