const github = require('@actions/github');

function getSearchClient() {
    return github.getOctokit(core.getInput('gh-token', { required: true }), {
        ...(searchBaseUrl !== "" && { baseUrl: searchBaseUrl })
    });
}

async function searchForCommitPullRequest(searchClient, commitSha) {
    const searchResponse = await searchClient.rest.search.issuesAndPullRequests({
        q: encodeURIComponent(commitSha),
    });
    console.log(`Request search PR for sha ${commitSha}:  ${searchResponse.headers['x-cache']}`);
    let prBodies = [];
    console.log(searchResponse);
    if (searchResponse.data.total_count > 1) {
        searchResponse.data.items.forEach(i => {
            prBodies.push(i.body);
        });
    }
    return prBodies;
}

module.exports = {
    getSearchClient,
    searchForCommitPullRequest
}