'use strict';
let AWS = require("aws-sdk");

module.exports.handle = async (event) => {
  try {
    var dynamoDb = new AWS.DynamoDB();

    var params = {
      TableName: 'rollable-tables',
      Item: {
        'userId': { S: event.userId },
        'tableId': { S: event.tableId },
        'tableName': { S: event.tableName },
        'tags': { SS: event.tags },
        'data': { S: JSON.stringify(event.data) },
      }
    };

    var result = await dynamoDb.putItem(params).promise();
    return {
      statusCode: 200,
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
