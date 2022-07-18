const github = require('@actions/github');

function getSearchClient(githubConfig) {
    return github.getOctokit(githubConfig.token, {
        ...(githubConfig.searchBaseUrl !== "" && { baseUrl: githubConfig.searchBaseUrl })
    });
}

async function searchForCommitPullRequest(searchClient, commitSha) {
    const searchResponse = await searchClient.rest.search.issuesAndPullRequests({
        q: encodeURIComponent(commitSha),
    });
    console.log(`Request search PR for sha ${commitSha}:  ${searchResponse.headers['x-cache']}`);
    let prBodies = [];
    console.log(JSON.stringify(searchResponse));
    if (searchResponse.data.total_count > 1 && searchResponse.status === 200) {
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