const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const testServer = async () => {
    await testNormal();
    await testNoToken();
    await testNotInTeam();
}

const testNormal = async () => {
    try {
        //This test assumes user1 and user2 are in the team. Ensure this before running the test.
        const testmsg = 'test message';
        const user1info = {
            email: "DONOTDELETE@purdue.edu",
            password: "V4lidPassword$"
        }

        const user2info = {
            email: "libbya@purdue.edu",
            password: "V4lidPassword$"
        }

        //get JWT keys
        const fetch1 = fetch('http://localhost:8000/login', {
            method:'POST',
            headers:{
                "content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify(user1info)
        })
        const fetch2 = fetch('http://localhost:8000/login', {
            method:'POST',
            headers:{
                "content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify(user2info)
        })

        const [res1, res2] = await Promise.all([fetch1, fetch2]);
        //console.log(res1.status, res2.status)
        const [user1, user2] = await Promise.all([res1.json(), res2.json()]);

        const token1 = user1.token;
        const token2 = user2.token;

        const socket1 = io.connect('http://localhost:8000', {
            query: {
                room:'5d84569de4ff8a0ce88b3720',
                token: token1
             }
        });
        
        const socket2 = io.connect('http://localhost:8000', {
            query: {
                room:'5d84569de4ff8a0ce88b3720',
                token: token2
             }
        });

        //User 1 sends message, listen on user 2's socket
        let gotMessage, gotGoodMessage = false, ready=false;
        socket2.on('message', msg => {
            gotMessage = msg;
            const decoded = jwt.decode(token1);
        })
        socket2.on('ready', () => {ready = true})
        socket1.on('ready', () => {
            while(!ready) {}
            socket1.emit('message', testmsg)
        })
        setTimeout(() => {
            socket1.close();
            socket2.close();
            if(!gotMessage) {
                console.log("Test Chat Server: Normal Behavior \x1b[31m%s\x1b[0m", "FAILED")
                console.log("User 2 didn't get the chat message user 1 sent.")
            } else {
                console.log("Test Chat Server: Normal Behavior \x1b[32m%s\x1b[0m", "PASSED")
            }
        }, 5000);
        return gotMessage;
    } catch(err) {
        console.log("Test Chat Server: Normal Behavior \x1b[31m%s\x1b[0m", "FAILED");
        console.error(err);
        return false;
    }
}

testNoToken = () => {
    try {
        let disconnected = false;
        const socket = io.connect('http://localhost:8000', {
            room:'5d84569de4ff8a0ce88b3720',
        });
        socket.on('disconnect', () => {
            disconnected = true;
        })
        setTimeout(() => {
            if(!disconnected) {
                console.log("Test Chat Server: No Token\x1b[31m%s\x1b[0m", "FAILED");
                console.log("Socket was not automatically disconnected");
            } else {
                console.log("Test Chat Server: No Token\x1b[32m%s\x1b[0m", "PASSED")
            }
        },5000);
    } catch(err) {
        console.log("Test Chat Server: No Token \x1b[31m%s\x1b[0m", "FAILED");
        console.log(err);
        return false;
    }
}

testNotInTeam = async () => {
    try {
        //this assumes that the user identified in userinfo is not in the team. This should be ensured before testing
        const userinfo = {
            email: "DONTJOINANYTEAMS@purdue.edu",
            password: "A$d4xxxx"
        }

        const res = await fetch('http://localhost:8000/login', {
            method:'POST',
            headers:{
                "content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify(userinfo)
        })
        const data = await res.json();

        let disconnected = false;
        const socket = io.connect('http://localhost:8000', {
            query: {
                room:'5d84569de4ff8a0ce88b3720',
                token: data.token
             }
        });
        socket.on('disconnect', () => {
            disconnected = true;
        })
        setTimeout(() => {
            if(!disconnected) {
                console.log("Test Chat Server: Not In Team\x1b[31m%s\x1b[0m", "FAILED");
                console.log("Socket was not automatically disconnected");
            } else {
                console.log("Test Chat Server: Not In Team\x1b[32m%s\x1b[0m", "PASSED")
            }
        },5000);
    } catch(err) {
        console.log("Test Chat Server: No Token\x1b[31m%s\x1b[0m", "FAILED");
        console.log(err);
        return false;
    }
}

module.exports = testServer;