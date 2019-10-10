const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const assert = require('assert');
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.use(express.urlencoded({extended:false}));

router.use(verify);
router.use(express.json());
router.get('/:id/invite', async (req, res) => {
    const invitee = req.params; // id of the user you want to invite
    const owner = req.token; // current user who wants to invite people

    if(invitee.id.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){

            assert.equal(null, err);
            const db = client.db("Teams");

            db.collection('team').find({
                $and:
                [{owner: owner},
                {alive: true},
                {numMembers: {$lte: maxMembers}}]
            }).toArray()
            ,then(teams => {
                //console.log(teams);
                client.close();
                res.status(200).json(teams);
                return;
            })

        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }
});

router.get('/:id/invite/:teamid', async (req, res) => {

    const {invitee, teamid, teamname} = req.query; // the user you want to invite and the team to invite to

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Users");

            var user = db.collection('user').find({
                _id:ObjectId(invitee.id)
            }).toArray(); 
        
            user.then(function (result) {
                db.collection('user').updateOne(
                    { _id:ObjectId(invitee.id) },
                    {
                        $push: { invites: {id: teamid, name: teamname} }
                    }
                ).then(function (r) {
                    try{
                        // Generate test SMTP service account from ethereal.email
                        // Only needed if you don't have a real mail account for testing
                        var testAccount = await nodemailer.createTestAccount();

                        // create reusable transporter object using the default SMTP transport
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: testAccount.user, // generated ethereal user
                                pass: testAccount.pass // generated ethereal password
                            }
                        })
                        var mailOptions = {
                            from: 'example@gmail.com>', // sender address
                            to: invitee.email, // list of receivers
                            subject: 'You have a new invite!', // Subject line
                            text: 'Please check your profile to find the invite details' //, // plaintext body
                            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                console.log(error);
                                res.json({yo: 'error'});
                            }else{
                                console.log('Message sent: ' + info.response);
                                res.json({yo: info.response});
                            };
                        });

                    }catch(error){
                        console.log(error);
                    }
                    res.status(200).send("added invite successfully");
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send(error);
                    client.close();
                    return;
                });

        }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
            })});
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

})