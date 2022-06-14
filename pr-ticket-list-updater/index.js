const core = require('@actions/core');
const github = require('@actions/github');

const pr = require('./pr');

// most @actions toolkit packages have async methods
async function run() {
  core.debug("omg");
  core.debug(github.context.sha);
  try {
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await pr(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
