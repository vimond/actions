const { DynamoDBClient, PutItemCommand, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");

const maxItemsNum = 25;

async function storeCommits(awsConfig, commits) {
    const client = new DynamoDBClient();

    let resp = [];
    for (let i = 0; i < commits.length; i += maxItemsNum) {
        resp.push(await client.send(new BatchWriteItemCommand({
            RequestItems: {
                [awsConfig.tableName]: commits.slice(i, i + maxItemsNum).map(function (item) {
                    let obj = {
                        "OwnerRepo": { S: item.ownerRepo },
                        "ID": { S: `commit:${item.commitSha}` },
                        "ParentSha": { S: item.parentSha }
                    };

                    if (item.Branch != "" && item.branch !== undefined) {
                        obj["Branch"] = { S: item.branch };
                    }

                    if (item.tickets.length > 0) {
                        obj["Tickets"] = { SS: item.tickets };
                    }

                    return {
                        PutRequest: {
                            Item: obj
                        }
                    };
                })
            }
        })));
    }

    return resp;
}

async function storeTag(awsConfig, tagInfo) {
    const client = new DynamoDBClient();

    let item = {
        "OwnerRepo": { S: tagInfo.ownerRepo },
        "ID": { S: `tag:${tagInfo.tag}` },
        "MappedCommit": { S: tagInfo.commitSha }
    };

    if (tagInfo.branch !== "" && tagInfo.branch !== undefined) {
        item["Branch"] = { S: tagInfo.branch };
    }

    return await client.send(new PutItemCommand({
        Item: item,
        TableName: awsConfig.tableName
    }));
}

async function storeOverrideRepoName(awsConfig, owner, repoName, overrideRepoName) {
    const client = new DynamoDBClient();

    return await client.send(new PutItemCommand({
        Item: {
            "OwnerRepo": { S: "vimond:" + overrideRepoName },
            "ID": { S: `reponame` },
            "RepoName": { S: repoName }
        },
        TableName: awsConfig.tableName
    }));
}

module.exports = {
    storeCommits,
    storeTag,
    storeOverrideRepoName
}