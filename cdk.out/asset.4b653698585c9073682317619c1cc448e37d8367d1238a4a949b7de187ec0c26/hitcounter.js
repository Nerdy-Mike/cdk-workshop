const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    // create AWS SDK clients
    const dynamo = new DynamoDB();
    const lambda = new Lambda();

    // update dynamo entry for path with hits++
    await dynamo.updateItem({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: event.path } },
        UpdateExpression: "ADD hits :incr",
        ExpressionAttributeValues: { ":incr": { N: "1" } }
    }).promise();

    // call downstream function and capture response
    const resp = await lambda.invoke({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(event)
    }).promise()

    console.log('downstream response:', JSON.stringify(resp, undefined, 2));

    // return downstream response back to upstream caller
    return JSON.parse(resp.Payload);
}   

/** You’ll notice that this code relies on two environment variables:

HITS_TABLE_NAME is the name of the DynamoDB table to use for storage.
DOWNSTREAM_FUNCTION_NAME is the name of the downstream AWS Lambda function.
Since the actual name of the table and the downstream function will only be decided when we deploy our app, we need to wire up these values from our construct code. We’ll do that in the next section. */