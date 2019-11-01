const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const assert = require('assert');
const jwt = require('jsonwebtoken');

router.use(express.json());
router.post('/', async (req,res) => {
    
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400).json({err:'missing email or password'});
        client.close();
        return;
    }

    //TODO: hash password before sending it to database
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var cursor = db.collection('user').find({
                email: email,
                password: password
            });
    
            cursor.toArray().then(result => {
                //console.log(result)
                if(result.length === 0) {
                    res.status(404).json({err:"Incorrect username or password"});
                    return;
                } else if(result.length === 1) {
                    const token = jwt.sign({
                        data: {
                            id: result[0]._id,
                            username: result[0].name || result[0].username,
                        }
                    }, dbconfig.jwt_key, { expiresIn: '1d' })
                    res.status(200).json({token:token,teams:result[0].curTeams,message:'successfully logged in'});
                    client.close();
                    return;
                } else {
                    res.status(500).json({err:"Found more than 1 user with that email and password."})
                    client.close();
                    return;
                }
            })
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;
