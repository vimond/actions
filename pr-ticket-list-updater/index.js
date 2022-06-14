const core = require('@actions/core');
const github = require('@actions/github');

const pr = require('./pr');

// most @actions toolkit packages have async methods
async function run() {
  core.debug(github.context.sha);
  try {
    let input = {
      inputFile: core.getInput("input-file") || process.env.INPUT_FILE,
      prId: core.getInput("pr-id") || process.env.PR_ID,
      dryRun: core.getBooleanInput("dry-run") || process.env.DRY_RUN,
    }

    console.log(`Input file: ${input.inputFile}`);
    console.log(`Pull Requests ID: ${input.prId}`);

    if(input.dryRun) {
      console.log("Dry run. Exiting");
      return;
    }

    console.log("doing stuff...");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
