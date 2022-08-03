const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

async function storePRTickets(awsConfig, owner, repoName, prID, tickets) {
    const client = new DynamoDBClient();

    return await client.send(new PutItemCommand({
        Item: {
            "OwnerRepo": { S: owner + ":" + repoName },
            "ID": { S: `PR:${prID}` },
            "Tickets": { SS: tickets }
        },
        TableName: awsConfig.tableName
    }));
}

module.exports = {
    storePRTickets
}