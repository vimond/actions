const { DynamoDBClient, PutItemCommand, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");

const maxItemsNum = 25;

async function storeCommits(awsConfig, commits) {
    const client = new DynamoDBClient();

    console.log("Storing commits");
    let resp = [];
    for (let i = 0; i < commits.length; i += maxItemsNum) {
        resp.push(await client.send(new BatchWriteItemCommand({
            RequestItems: {
                [awsConfig.tableName]: commits.slice(i, i + maxItemsNum).map(function (item) {
                    let obj = {
                        "OwnerRepo": { S: item.ownerRepo },
                        "ID": { S: `commit:${item.commitSha}` },
                        "ParentSha": { S: item.parentSha },

                        "Owner": { S: item.owner },
                        "Repo": { S: item.repo },
                        "ChangeType": { S: "commit" },
                        "ChangeId": { S: item.commitSha }
                    };

                    if (item.Branch !== "" && item.branch !== undefined) {
                        obj["Branch"] = { S: item.branch };
                    }

                    if (item.tickets.length > 0) {
                        obj["Tickets"] = { SS: item.tickets };
                    }

                    if (item.prs.length > 0) {
                        obj["PRs"] = { NS: item.prs.map(pr => `${pr}`) };
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

// The original repo name is needed to clone the repo when getting the commits between two deployments
async function storeOverrideRepoName(awsConfig, owner, repoName, overrideRepoName) {
    const client = new DynamoDBClient();

    return await client.send(new PutItemCommand({
        Item: {
            "OwnerRepo": { S: `${owner}:${overrideRepoName}` },
            "ID": { S: "reponame" },
            "OverrideRepoName": { S: repoName }
        },
        TableName: awsConfig.tableName
    }));
}

module.exports = {
    storeCommits,
    storeOverrideRepoName
}