'use strict';
let AWS = require("aws-sdk");

module.exports.handle = async (event) => {
  try {

    let pathParameters = event.pathParameters;

    let dynamoDb = new AWS.DynamoDB.DocumentClient({
      service: new AWS.DynamoDB(
        {
          apiVersion: "2012-08-10"
        }),
      convertEmptyValues: true
    });

    var params = {
      TableName: "rollable-tables-groups-bridge",
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: { ':groupId': pathParameters.groupId }
    };

    var result = await dynamoDb.query(params).promise();
    var items = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(items),
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
