const github = require('@actions/github')
const core = require("@actions/core");
require('dotenv').config()

async function getPrTextBlocks( octokitClient, prMetadata ) {
    const pullRequestResponse = await octokitClient.rest.pulls.get({
        owner: prMetadata.owner,
        repo: prMetadata.repository,
        pull_number: prMetadata.prNumber
    });

    if ( pullRequestResponse.status !== 200 ) {
        throw new Error('Failed to retrieve PR metadata')
    }
    return [pullRequestResponse.data.title, pullRequestResponse.data.body]
}

async function getAllCommitMessages( octokitClient, prMetadata ) {

    const commitResponse = await octokitClient.rest.pulls.listCommits({
        owner: prMetadata.owner,
        repo: prMetadata.repository,
        pull_number: prMetadata.prNumber
    });

    if ( commitResponse.status !== 200 ) {
        throw new Error('Failed to retrieve all commit messages')
    }
    let messages = []
    for( let c of commitResponse.data) {
        messages.push(c.commit.message);
        //messages.push(...await lookForMergeInformation(c));
    }

    return messages;
}

async function lookForMergeInformation(commitMetadata) {
    return [];
}


async function getAllTextBlocks(owner, repository, prNumber){
    const prMetadata = {
        owner,
        repository,
        prNumber
    }
    const ghToken = process.env.GH_TOKEN || core.getInput('gh-token') ;
    const octokit = github.getOctokit(ghToken)
    let textBlocks = []
    textBlocks.push(...await getPrTextBlocks(octokit, prMetadata));
    textBlocks.push(...await getAllCommitMessages(octokit, prMetadata));
    return textBlocks;
}



module.exports = {
    getAllTextBlocks
}