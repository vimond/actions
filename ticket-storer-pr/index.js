require('dotenv').config();
const ticketSender = require('./src/dynamodb');
const core = require('@actions/core');
const fs = require('fs');

async function run() {
  try {
    console.log("Start storing tickets");

    const input = {
      owner: core.getInput("owner", { required: true }),
      repo: core.getInput("repository", { required: true }),
      overrideRepo: core.getInput("override-repository", { required: false }),
      prID: core.getInput("pr-id", { required: true }),
      inputFile: core.getInput("input-file"),
      tickets: core.getInput("tickets"),
    };

    const awsConfig = {
      tableName: core.getInput("dynamodb-tablename", { required: true }),
    };

    if (input.overrideRepo != undefined && input.overrideRepo !== "") {
      input.repo = input.overrideRepo;
    }


    if (input.tickets === "") {
      input.tickets = readTicketFile(input.inputFile);
    } else {
      input.tickets = convertTicketInput(input.tickets);
    }
    const parsedTickets = JSON.parse(input.tickets);

    const resp = await ticketSender.storePRTickets(awsConfig, input.owner, input.repo, input.prID, parsedTickets);
    console.log(`Tickets for PR ${input.prID} stored: ${resp}`);
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
