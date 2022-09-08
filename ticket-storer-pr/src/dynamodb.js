const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

async function storePRTickets(awsConfig, owner, repoName, prID, tickets) {
    const client = new DynamoDBClient();

    return await client.send(new PutItemCommand({
        Item: {
            "OwnerRepo": { S: `${owner}:${repoName}` },
            "ID": { S: `PR:${prID}` },
            "Tickets": { SS: tickets },

            "Owner": { S: owner },
            "Repo": { S: repoName },
            "ChangeType": { S: "PR" },
            "ChangeId": { S: prID }
        },
        TableName: awsConfig.tableName
    }));
}

module.exports = {
    storePRTickets
}