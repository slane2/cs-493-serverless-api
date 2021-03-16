//References
// https://medium.com/think-serverless/image-upload-and-retrieval-from-s3-using-aws-api-gateway-and-lambda-b4c2961e8d1
//https://stackoverflow.com/questions/9437581/node-js-amazon-s3-how-to-iterate-through-all-files-in-a-bucket

const express = require('serverless-express/express');
const AWS = require('aws-sdk');

var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-west-2"});

var app = express();

app.get("/auth", function(req, res) {
    const auth = req.get("authorization");
    res.send({
        foo: "bar",
        baz: "luhrman",
        auth,
    });
});

const handler = require("serverless-express/handler");

module.exports.api = handler(app);

module.exports.hello = (event, context, callback) => {
    const params = {
        Bucket: 'shaylalalala522'
    };
    s3.listObjectsV2(params, (err, data) => {
        let song_list = []
        for (let item of data.Contents) {
            let url = s3.getSignedUrl('getObject', {
                Bucket: 'shaylalalala522',
                Key: item.Key,
            });
            song_list.push(url);
        }
        let response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
        },
        "body": JSON.stringify(song_list),
        "isBase64Encoded": false
    };
        callback(null, response);
    })
}
