const express = require('express');
const mongo = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async (req,res) => {
    console.log("Signup", req.body);
    
    const {email, screenname, password} = req.body;
    if(!email || !password || !screenname) {
        res.status(400).json({err:"Missing email, password, or screenname"}).send();
        return;
    }
    
    var emailRegex = /\@purdue\.edu/
    if (emailRegex.test(email) == false) {
        console.log('must register with a purdue email address');
        res.status(400).json({err:"Invalid email"}).send();
        return;
    }

    // Check password length
    if (password.length < 8 || password.length > 20) {
        // TODO: set popup to say password length is wrong
        console.log('password must be between 8 and 20 characters');
        return;
    }
    
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
    if (passwordRegex.test(password) == false) {
        res.status(400).json({err:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'}).send();
        return;
    }

    if (screenname.length < 5 || screenname.length > 16) {
        res.status(400).json({err:'Screen name must be between 5 and 16 characters'}).send();
        return;
    }

    var screennameRegex = /^[0-9a-zA-Z@#$%^&*()_]/
    if (screennameRegex.test(screenname) == false) {
        res.status(400).json({err:'Invalid screen name'}).send();
        return;
    }
    
    try {
        console.log("Hi!");
        const client = await mongo.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
        
        const db = client.db("Users");
        var cursor = db.collection('user').find({
            $or: [ {email: email}, {username: screenname} ]
        });
        let result = await cursor.count();
        
        // User already exists
        if (result > 0) {
            client.close();
            res.status(400).json({err:"User with that username or email already exists."}).send();

        // Create a new user    
        } else if (result == 0) {
            //TODO: hash password before storing it
            count = await db.collection('user').insertOne({
                email: email,
                password: password,
                username: screenname
            });
            //console.log(count);
            client.close();
            res.sendStatus(201);  //TODO: send cookie 
        }
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;