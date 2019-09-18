const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Get Current User
var currUser = readCookie(name);

if(currUser == null){
    console.log('not logged in');
    window.location.href = "/"
}

