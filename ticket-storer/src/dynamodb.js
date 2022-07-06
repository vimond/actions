const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

async function send(input, awsConfig) {
    const client = new DynamoDBClient({ region: awsConfig.region })

    return await client.send(new PutItemCommand({
        Item: {
            "PK": { S: input.owner + ":" + input.repo },
            "CommitSha": { S: input.commitSha },
            "ParentSha": { S: input.parentSHA },
            "Tag": { S: input.tag },
            "Branch": { S: input.branch },
            "Ticekts": { SS: input.tickets },
            "Timestamp": { S: input.createdAt },
        },
        TableName: awsConfig.tableName
    }));
}

module.exports = {
    send
}
