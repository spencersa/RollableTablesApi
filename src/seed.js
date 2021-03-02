'use strict';
let AWS = require("aws-sdk");
const uuid = require('uuid');

module.exports.handle = async (event) => {
    try {
        let pathParameters = event.pathParameters;
        var docClient = new AWS.DynamoDB.DocumentClient();

        let seedTablesResult, params;
        let seedTables = [];
        while (true) {
            params = {
                TableName: "seed-tables"
            };
            if (seedTablesResult && seedTablesResult.LastEvaluatedKey) {
                params.ExclusiveStartKey = seedTablesResult.LastEvaluatedKey;
            }
            seedTablesResult = await docClient.scan(params).promise();
            seedTablesResult.Items.forEach(x => {
                seedTables.push(x);
            });
            if (!seedTablesResult.LastEvaluatedKey) {
                break;
            }
        }

        let putRequests = [];
        seedTables.forEach(seedTable => {
            putRequests.push({
                PutRequest: {
                    Item: {
                        userId: pathParameters.userId,
                        tableId: uuid.v1(),
                        data: seedTable.data,
                        tableName: seedTable.tableName,
                        tags: seedTable.tags
                    }
                }
            });
        });

        let batchParams = {
            RequestItems: {
                'rollable-tables': putRequests
            }
        };

        await docClient.batchWrite(batchParams).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500
        };
    }
};
