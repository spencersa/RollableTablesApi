'use strict';
let AWS = require("aws-sdk");
const uuid = require('uuid');

module.exports.handle = async (event) => {
    try {
        let pathParameters = event.pathParameters;
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: 'rollable-tables-groups-bridge',
            Item: {
              'groupId': pathParameters.groupId,
              'tableId': pathParameters.tableId
            }
          };

        await docClient.put(params).promise();

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
