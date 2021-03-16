// References
// https://www.serverless.com/blog/serverless-express-rest-api
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessage-property
//https://www.serverless.com/blog/aws-lambda-sqs-serverless-integration
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessage-property

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const express = require('express'),
    app = express();

const MUSIC_TABLE = process.env.MUSIC_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var sqs = new AWS.SQS();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send('Yaaaasss queen')
})

app.get('/genres/', function (req, res) {
    const params = {
        TableName: 'music',
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'genre',
            ':sk': 'genre'
        },
    }

    dynamoDb.query(params, function(err, data) {
    if (err) console.log(err);
    else {
        genres = [];
        data.Items.forEach(function(item) {
        genres.push(item.info.genre);
        });
        res.send({
        "Genres": genres
        });
    }
    });
    })

app.get('/artists/for/:genre', function (req, res) {
    const genre = req.params.genre;
    const params = {
        TableName: 'music',
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            //primary key
            //HASH
            ':pk': 'genre#' + genre,
            //Sort Key
            //RANGE
            ':sk': 'artist'
        },
    }

    dynamoDb.query(params, function(err, data) {
        if (err) console.log(err);
        else {
            artists = [];
            data.Items.forEach(function(item) {
                artists.push(item.info.artist);
            });
            res.send({
                "Artists": artists
            });
        }
    });
})

app.get('/albums/for/:artist', function (req, res) {
    const artist = req.params.artist;
    const params = {
        TableName: 'music',
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
        ':pk': 'artist#' + artist,
        ':sk': 'album'
        },
    }

    dynamoDb.query(params, function(err, data) {
        if (err) console.log(err);
        else {
            albums = [];
            data.Items.forEach(function(item) {
            albums.push(item.info.album);
            });
            res.send({
                "Albums": albums
            });
        }
    });
})

app.get('/songs/for/:album', function (req, res) {
    const album = req.params.album;
    const params = {
        TableName: 'music',
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'album#' + album,
            ':sk': 'song'
        },
    }

    dynamoDb.query(params, function(err, data) {
        if (err) console.log(err);
        else {
            songs = [];
            data.Items.forEach(function(item) {
            songs.push(item.info.song);
            });
            res.send({
                "Songs": songs
            });
        }
    });
})

app.get('/song/:song', function (req, res) {
    const song = req.params.song;
    const params = {
        TableName: 'music',
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
        ':pk': 'song',
        ':sk': 'song#' + song
        },
    }

    dynamoDb.query(params, function(err, data) {
        if (err) console.log(err);
        else {
            location = data.Items[0].info.key;
            var s3 = new AWS.S3();
            let url = s3.getSignedUrl('getObject', {
                Bucket: 'shaylalalala522',
                Key: location, 
            });
            res.send({
                "URL": url
            });
        }
    });
})

// app.post('/play', function (req, res) {
//     var sqs = new AWS.SQS();

//     if(!req.body.artist) {
//         return res.status(400).send({
//             success: 'false',
//             message: 'Missing artist'
//         });
//     } else if(!req.body.album) {
//         return res.status(400).send({
//             success: 'false',
//             message: 'Missing album'
//         });
//     } else if(!req.body.song) {
//         return res.status(400).send({
//             success: 'false',
//             message: 'Missing song'
//         });
//     }

//     const song_body = JSON.stringify({
//         artist: req.body.artist,
//         album: req.body.album,
//         song: req.body.song
//     });
    
//     var params = {
//         MessageBody: song_body,      
//         QueueUrl: 'https://sqs.us-east-1.amazonaws.com/297181656029/MyQueue',
//     };
    
//     sqs.sendMessage(params, function(err, data) {
//         if (err) console.log(err, err.stack); 
//         else     console.log(data);           
//     });
//     return res.status(201).send({
//         success: 'true',
//         message: 'You did it!',
//     })
// })

app.post('/play', function (req, res) {

    const params = {
        MessageBody: 
        JSON.stringify({
            artist: req.body.artist,
            album: req.body.album,
            song: req.body.song
        }),
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/297181656029/MyQueue'
    };
    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log("Failed", err);
        } else {
            res.send({ "Success": true });
        }
    });
})

module.exports.handler = serverless(app);