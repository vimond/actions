async function checkIfExist(jiraConfig, tickets) {
    const auth = Buffer.from(`${jiraConfig.username}:${jiraConfig.token}`);
    const f = await fetch(`https://${jiraConfig.proxy}/rest/api/2/search?` + new URLSearchParams({
        jql: `issue IN ( ${tickets.join(',')} )`,
        fields: "*all",
        maxResults: 50
    }),
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${auth}`
            }
        });

    const resp = await f.json();

    console.log(`Warnings: ${resp.data.warningMessages}`);

    return resp.data.issues.map(issue => (
        {
            key: issue.key,
            summary: issue.fields.summary,
            link: `https://${jiraConfig.host}/browse/${issue.key}`
        }
    ));
}

module.exports = {
    checkIfExist
}