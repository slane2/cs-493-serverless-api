//References
// https://medium.com/think-serverless/image-upload-and-retrieval-from-s3-using-aws-api-gateway-and-lambda-b4c2961e8d1

// 'use strict';
const express = require('serverless-express/express');
// const handler = require('serverless-express/handler');
const AWS = require('aws-sdk');
// app.use(express.json());

var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-east-1"});

var app = express();

// app.get('/ex', function(req, res) {
//   res.send({
//     foo: "bar",
//     baz: "luhrman",
//   });
// });

var s3 = new AWS.S3();
module.exports.hello = (event, context, callback) => {
  const params = {
    "Bucket": 'shaylalalala522',
  };
  s3.listObjects(params, function(err, data){
    if(err) {
      callback(err, null);
    } else {
      let response = {
        "statusCode": 200,
        "headers": {
          "my_header": "my_value",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        "body": JSON.stringify(data.Contents, ['Key']),
        "isBase64Encoded": false
      };
      callback(null, response);
    }
  });
}

// GET ONE URL
// module.exports.hello = (event, context, callback) => {
//   var params = {
//     "Bucket": 'shaylalalala522'
//   };
//   var promise = s3.getSignedUrlPromise('listObjects', params);
//   promise.then(function(url) {
//     let response = {
//       "statusCode": 200,
//       "headers": {
//           "my_header": "my_value",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Credentials": true,
//       },
//       //"body": JSON.stringify(data.Contents,["Key"]),
//       "body": JSON.stringify(url),
//       "isBase64Encoded": false
//     };
//     callback(null, response);
//   }, function(err) { callback(err, null); });
// };

// app.get('/dotify', (req, res) => {
//   const params = {
//     "Bucket": 'shaylalalala522',
//   };
//   s3.listObjectsV2(params, (err, data) => {
//     if(err) {
//       callback(err, null);
//     } else {
//       console.log('S3 Contents', data);
//       let song_list = []
//       for(let i of data.Contents) {
//         let loc = s3.getSignedUrl('getObject', {
//           Bucket: 'shaylalalala522',
//           Key: i.Key,
//           Expires: 200
//         });
//         song_list.push(loc);
//       }
//       res.send(song_list);
//     }
//   })
// });


    



// module.exports.get_music = handler(app);

// module.exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
