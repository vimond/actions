const maxResults = 1000;

async function checkIfExist(nodeFetch, jiraConfig, tickets) {
    const auth = Buffer.from(`${jiraConfig.username}:${jiraConfig.token}`).toString("base64");
    let filteredTickets = [];
    for (let i = 0; i < tickets.length; i += maxResults) {
        const newTickets = await processBatch(nodeFetch, auth, jiraConfig.proxy, jiraConfig.host, tickets.slice(i, i + maxResults))
        filteredTickets.concat(newTickets)
    }

    return filteredTickets;
}

async function processBatch(nodeFetch, auth, proxy, jifraHost, tickets) {
    const f = await nodeFetch(`https://${proxy}/rest/api/2/search?` + new URLSearchParams({
        jql: `issue IN ( ${tickets.join(',')} )`,
        fields: "*all",
        maxResults: maxResults
    }),
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${auth}`
            }
        });

    if (f.status != 200) {
        console.log(`Non-200 status code returned by JIRA: ${f.status}`);
    }
    const textResp = await f.text();
    try {
        const jsonResp = JSON.parse(textResp);
    } catch (e) {
        console.log(`Couldn't parse JSON resp: ${e}. Resp: ${textResp}`);
        throw e;
    }

    console.log(`Warnings: ${resp.data.warningMessages}`);

    return resp.data.issues.map(issue => (
        {
            key: issue.key,
            summary: issue.fields.summary,
            link: `https://${jifraHost}/browse/${issue.key}`
        }
    ));
}

module.exports = {
    checkIfExist
}
