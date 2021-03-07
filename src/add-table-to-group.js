'use strict';
let AWS = require("aws-sdk");
const uuid = require('uuid');

module.exports.handle = async (event) => {
    try {
        let body = JSON.parse(event.body);
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: 'rollable-tables-groups-bridge',
            Item: {
              'groupId': body.groupId,
              'tableId': body.tableId
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
