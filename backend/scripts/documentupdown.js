const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
//const Grid = require('gridfs-stream');

const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';
function uploadFile(path, name) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
        assert.equal(null, err);
        const filedb = client.db("Files");

        const bucket = new mongodb.GridFSBucket(filedb, {
            chunkSizeBytes: 1024,
            bucketName: 'files'
        });

        fs.createReadStream(path).
            pipe(bucket.openUploadStream(name)).
            on('error', function(error) {
                assert.ifError(error);
            }).
            on('finish', function() {
                console.log('file uploaded');
                process.exit(0);
            });

    });
}

function downloadFile(name) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
        assert.equal(null, err);
        const filedb = client.db("Files");

        const bucket = new mongodb.GridFSBucket(filedb, {
            chunkSizeBytes: 1024,
            bucketName: 'files'
        });

        bucket.openDownloadStreamByName(name).
            pipe(fs.createWriteStream('./' + name)).
            on('error', function(error) {
                assert.ifError(error);
            }).
            on('finish', function() {
                console.log('file downloaded');
                process.exit(0);
            });
    });
}