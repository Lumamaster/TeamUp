//const MongoClient = require('mongodb').MongoClient;
//const mongodb = require('mongodb');
//const assert = require('assert');
const fs = require('fs');


const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

var Grid = require('gridfs-stream');
const mongoose = require('mongoose');
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);


function uploadFile(path, id) {
    var writestream = GridFS.createWriteStream({
        _id: id
    });
    writestream.on('close', function (file) {
        callback(null, file);
    });
    fs.createReadStream(path).pipe(writestream);
}

function deleteFile(id) {
    GridFS.remove({_id: id}, function (err) {
        console.log(err);
    });
}