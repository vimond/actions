const jiraSearch = require('jira-search');

function shouldCheckIfExists(jiraConfig) {
    return jiraConfig &&
        jiraConfig.host && jiraConfig.host !== ""  &&
        jiraConfig.username && jiraConfig.username !== "" &&
        jiraConfig.token && jiraConfig.token !== "" ;
}

async function checkIfExist(jiraConfig, tickets) {
    if (! shouldCheckIfExists(jiraConfig)){
        console.log('Jira validation pre-requisites missing, skipping verifying if ticket exits')
        return [];
    }

    if ( tickets.length === 0 ){
        return [];
    }

    return await jiraSearch({
        serverRoot: `https://${jiraConfig.proxy}`,
        strictSSL: true,
        user: jiraConfig.username,
        pass: jiraConfig.token,
        jql: `issue IN ( ${tickets.join(',')} )`,
        fields: '*all',
        maxResults: 50, // the maximum number of results for each request to JIRA, multiple requests will be made till all the matching issues have been collected
        mapCallback: function (issue) {
            return {
                key: issue.key,
                summary: issue.fields.summary,
                link: `https://${jiraConfig.host}/browse/${issue.key}`
            };
        }
    });
}

module.exports = {
    checkIfExist
}