const github = require('@actions/github');

function getSearchClient(githubConfig) {
    return github.getOctokit(githubConfig.token, {
        ...(githubConfig.searchBaseUrl !== "" && { baseUrl: githubConfig.searchBaseUrl })
    });
}

// Getting pull request numbers assosiated with a commit.
// Storing the PR number instad of commits in the PR body in case the body is later updated with new tickets.
async function searchForCommitPullRequest(searchClient, commitSha) {
    const searchResponse = await searchClient.rest.search.issuesAndPullRequests({
        q: encodeURIComponent(commitSha),
    });
    console.log(`Request search PR for sha ${commitSha}:  ${searchResponse.headers['x-cache']}`);
    let prs = [];

    if (searchResponse.status === 200 && searchResponse.data.total_count > 1) {
        searchResponse.data.items.forEach(i => {
            if (i.pull_request !== undefined) {
                prs.push(i.number);
            }
            // TODO: handle issues?
        });
    }
    return prs;
}

module.exports = {
    getSearchClient,
    searchForCommitPullRequest
}