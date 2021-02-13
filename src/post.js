'use strict';
let AWS = require("aws-sdk");

module.exports.handle = async (event) => {
  try {
    var dynamoDb = new AWS.DynamoDB();

    let body = JSON.parse(event.body) 

    var params = {
      TableName: 'rollable-tables',
      Item: {
        'userId': { S: body.userId },
        'tableId': { S: body.tableId },
        'tableName': { S: body.tableName },
        'tags': { SS: body.tags },
        'data': { S: JSON.stringify(body.data) },
      }
    };

    await dynamoDb.putItem(params).promise();
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
