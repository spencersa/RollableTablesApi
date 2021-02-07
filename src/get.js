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
      TableName: "rollable-tables",
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': pathParameters.userId }
    };

    var result = await dynamoDb.query(params).promise();

    var items = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500
    };
  }
};
