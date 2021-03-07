'use strict';
let AWS = require("aws-sdk");
const uuid = require('uuid');

module.exports.handle = async (event) => {
    try {
        let pathParameters = event.pathParameters;
        var docClient = new AWS.DynamoDB.DocumentClient();

        let groupId = pathParameters.groupId ? pathParameters.groupId : uuid.v1();

        var params = {
            TableName: 'rollable-tables-groups',
            Item: {
              'groupId': groupId,
              'userId': pathParameters.userId,
              'groupName': pathParameters.groupName
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
