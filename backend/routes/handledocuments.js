const mongo = require('mongodb');
const router = require('express').Router();
const multer = require('multer');
const verify = require('../verifyjwt');
const {url, jwt_key} = require('../db_config.json');
const {Readable} = require('stream');
const jwt = require('jsonwebtoken');

//Upload a file
//request body be multipart form data with attributes 'name' (the filename) and 'doc' (the file)
router.post('/:teamId', verify, async (req,res) => {
    try {
        const client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

        //Ensure that the user is in the team
        const team = await client.db('Teams').collection('team').findOne({_id:mongo.ObjectId(req.params.teamId)});
        if(!team) {
            res.status(400).json({err:"Invalid team"});
            return;
        }
        let isInTeam = false;
        for(let i = 0; i < team.teamMembers.length; i++) {
            if(team.teamMembers[i].id === req.token.id) {
                isInTeam = true;
                break;
            }
        }
        if(!isInTeam) {
            res.status(400).json({err:"You are not in that team"});
            return;
        }
        const db = client.db('Grid');
        const storage = multer.memoryStorage()
        const upload = multer({storage: storage, limits: {fields:1, fileSize: 1000000, files: 1, parts: 2}});
        upload.single('doc')(req,res, (err => {
            if(err) {
                console.log(err)
                res.status(400).json({err: "Validation failed"});
                return;
            } else if(!req.body.name) {
                res.status(400).json({err:"No document name in request body"})
                return;
            }

            let docName = req.body.name;
            const readableDocStream = new Readable();
            readableDocStream.push(req.file.buffer);
            readableDocStream.push(null);

            let bucket = new mongo.GridFSBucket(db, {
                bucketName: 'documents'
            });

            let uploadStream = bucket.openUploadStream(docName, {
                metadata: {
                    uploaderId: req.token.id,
                    teamId: req.params.teamId
                }
            });
            readableDocStream.pipe(uploadStream);

            uploadStream.on('error', () => {
                res.status(500).json({err:"Error uploading file"})
                return;
            })

            uploadStream.on('finish', () => {
                res.sendStatus(200);
                req.app.io.to(req.params.teamId).emit('message', {
                    sender: req.token.name || req.token.username || req.token.id,
                    senderId: req.token.id,
                    fileId: uploadStream.id,
                    filename: req.body.name,
                    type:'file'
                })
                //console.log(uploadStream.id);
                client.db('Teams').collection('team').findOneAndUpdate({_id:mongo.ObjectId(req.params.teamId)},{
                    $push: {
                        chat:{
                            sender: req.token.name || req.token.username || req.token.id,
                            senderId: req.token.id,
                            fileId: uploadStream.id,
                            filename: req.body.name,
                            type:'file'
                        }
                    }
                })
                client.close();
                return;
            })
        }))
    } catch(err) {
        console.log(err);
        res.status(500).json({err})
        return;
    }
})

//Download a file
//URL should contain the file's id
//User should be part of the team that the file was uploaded to
router.get('/:id', async (req,res) => {
    try {
        const {token} = req.query;
        const decoded = (await jwt.verify(token, jwt_key)).data
        const userId = decoded && decoded.id;
        if(!decoded || !userId) {
            res.status(401).send()
        }
        const docId = mongo.ObjectId(req.params.id);
        const client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        let bucket = new mongo.GridFSBucket(client.db('Grid'), {
            bucketName: 'documents'
        });

        let file = await bucket.find({_id:docId}).toArray();
        if(file.length !== 1) {
            res.status(404).json({err:"File not found"});
        }
        file = file[0];
        let team = await client.db('Teams').collection('team').findOne({_id:mongo.ObjectId(file.metadata.teamId)});
        if(!team) {
            res.sendStatus(500);
            return;
        }
        let isInTeam = false;
        for(let i = 0; i < team.teamMembers.length; i++) {
            if(team.teamMembers[i].id === userId) {
                isInTeam = true;
                break;
            }
        }
        if(!isInTeam && file.metadata.uploaderId !== userId) {  //Let the user download if it's their file, even if not in team
            res.status(400).json({err:"You are not in that team"});
            return;
        }
        let downloadStream = bucket.openDownloadStream(docId);
        res.attachment(file.filename);

        downloadStream.on('data', chunk => {
            res.write(chunk);
        })

        downloadStream.on('error', () => {
            res.sendStatus(404);
            return;
        })

        downloadStream.on('end', () => {
            res.end();
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({err})
        return;
    }
})

module.exports = router;