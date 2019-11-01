const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const router = express.Router();
const assert = require('assert');
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded({extended:false}));

router.use(verify);
router.use(express.json());

router.get('/:userId/:teamId/:teamname', async (req, res) => {

    const {userId, teamId, teamname} = req.params; // the user you want to invite and the team to invite to

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Users");

            var user = db.collection('user').find({
                _id:ObjectId(userId)
            }).toArray(); 
        
            user.then(function (result) {
                db.collection('user').updateOne(
                    { _id:ObjectId(userId) },
                    {
                        $push: { invites: {id: teamId, name: teamname} }
                    }
                ).then(function (r) {
                    /*try{
                        // Generate test SMTP service account from ethereal.email
                        // Only needed if you don't have a real mail account for testing
                        var testAccount = nodemailer.createTestAccount();

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
                                //res.json({yo: 'error'});
                            }else{
                                console.log('Message sent: ' + info.response);
                                //res.json({yo: info.response});
                            };
                        });

                    }catch(error){
                        console.log(error);
                    }*/
                    res.status(200).send("added invite successfully");
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send("adding invite not successful");
                    client.close();
                    return;
                });

        }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
                return;
        })});
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
        client.close();
        return;
    }

})

module.exports = router;