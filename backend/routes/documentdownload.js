const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const express = require('express');
const router = express.Router();
/*const multer = require('multer');
const assert = require('assert');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});

let db;

const { Readable } = require('stream');*/
const fs = require('fs');

const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

var Grid = require('gridfs-stream');
const mongoose = require('mongoose');
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);
const app = express();
app.use('/files', router);

/*MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, database) {
    assert.equal(null, err);
    db = database;
});*/

router.get('/:fileID', (req, res) => {
    try {
        var readstream = GridFS.createReadStream({_id: req.params.id});
        readstream.pipe(res);
    } catch (err) {
        log.error(err);
        return next(errors.create(404, "File not found."));
    }
});

/*router.get('/:fileID', (req, res) => { //uses mongo object id as parameter
    try {
        var fileID = new ObjectID(req.params.fileID);
    } catch(err) {
        return res.status(400).json({ message: "Invalid file ID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
    }

    let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'files'
    });

    let downloadStream = bucket.openDownloadStream(fileID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
});

router.post('/', (req, res) => { // file is the request
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Upload Request Validation Failed" });
        } else if(!req.body.name) {
            return res.status(400).json({ message: "No file name in request body" });
        }

        let fileName = req.body.name;

        // Covert buffer to Readable Stream
        const readbleFileStream = new Readable();
        readbleFileStream.push(req.file.buffer);
        readbleFileStream.push(null);

        let bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'files'
        });

        let uploadStream = bucket.openUploadStream(fileName);
        let id = uploadStream.id;
        readbleFileStream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on('finish', () => {
            return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
        });
    });
});*/
