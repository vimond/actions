const core = require('@actions/core');
const github = require('@actions/github');

const pr = require('./pr');

// most @actions toolkit packages have async methods
async function run() {
  // core.debug("omg");
  // core.debug(github.context.sha);
  try {
    // const ms = core.getInput('milliseconds');
    // core.info(`Waiting ${ms} milliseconds ...`);

    let m = pr();
    // console.log(pr.test("nonono"));
    // console.log(pr.test("aaafoobbbbarbaz"));

    // core.info((new Date()).toTimeString());

    // core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
