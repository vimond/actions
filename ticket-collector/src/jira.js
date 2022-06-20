const jiraClient = require('jira-client');

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

    const client = new jiraClient({
        protocol: 'https',
        apiVersion: '2',
        host: jiraConfig.host,
        password: `${jiraConfig.token}`,
        username: `${jiraConfig.username}`,
        strictSSL: true
    })


    const noop = function(){}
    const ticketPromises = tickets.map(t => {
        return client.findIssue(t).catch(noop);
    })
    const ticketsFiltered = (await Promise.all(ticketPromises)).filter(r => typeof r != 'undefined').map(r => r.key )

    console.log(ticketsFiltered);
    return ticketsFiltered;
}

module.exports = {
    checkIfExist
}