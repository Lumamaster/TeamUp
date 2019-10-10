const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const mongo = require('mongodb');
const config = require('./db_config.json')
const login = require('./routes/login');
const signup = require('./routes/signup');
const viewProfile = require('./routes/viewprofile');
const removeTeam = require('./routes/leaveTeam');
const listTeams = require('./routes/listteams');
const editTeam = require('./routes/editteam');
const editProfile = require('./routes/editProfile');
const searchUser = require('./routes/searchuser');
const startTeam = require('./routes/startteam');
const joinTeam = require('./routes/jointeam');
const leaveReview = require('./routes/leavereview');
const viewTeamSkills = require('./routes/viewteamskills');
const kickUser = require('./routes/kickUser');
const block = require('./routes/blockuser');

const port = process.env.PORT || 8000;
app.use(cors())

app.use('/login', login);
app.use('/signup', signup);
app.use('/teams/leave', removeTeam);
app.use('/teams/join', joinTeam);
app.use('/teams/edit', editTeam);
app.use('/user/profile/edit', editProfile);
app.use('/search', searchUser);
app.use('/teams', listTeams);
app.use('/profile', viewProfile);
//app.use('/profile/edit', editProfile);
app.use('/startteam',startTeam);
app.use('/leavereview', leaveReview);
app.use('/teamskills', viewTeamSkills);
app.use('/kickuser', kickUser);
app.use('/blk', block);
//app.use('/teams/create', createTeam);
//app.use('/user/teams/join', joinTeam);

http.listen(port, () => console.log(`Server running on port ${port}`));

io.use(async (socket, next) => {
    if(socket.user) return next();
    try {
        const user = await jwt.verify(socket.handshake.query.token, config.jwt_key)
        socket.user = {
            id: user.data.id,
            name: user.data.name || user.data.username || user.data.id
        }
        return next();
    } catch(err) {
        console.log(err)
        socket.disconnect();
    }
})

io.on('connection', async socket => {
    //console.log(socket.user.name,"connected!")
    const {room} = socket.handshake.query
    //console.log(room)
    try {
        const client = await mongo.MongoClient.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true });
        const team = await client.db('Teams').collection('team').findOne({_id:mongo.ObjectId(room)});
        //console.log(team)
        let isInTeam = false;
        team.teamMembers.forEach(async member => {
            if(!isInTeam && member.id === socket.user.id) {
                //console.log(socket.user.name, 'joins', room);
                isInTeam = true;
                socket.join(room);
                socket.on('message', msg => {
                    //console.log("Send message to", room)
                    io.to(room).emit('message', {
                        sender: socket.user.name,
                        senderId: socket.user.id,
                        body: msg
                    })
                    client.db('Teams').collection('team').findOneAndUpdate({_id:mongo.ObjectId(room)},{
                        $push: {
                            chat: {
                                sender: socket.user.name,
                                senderId: socket.user.id,
                                body: msg
                            }
                        }
                    })
                })
                socket.emit('ready', {
                    myId: socket.user.id,
                    messages: team.chat || []
                })    //TODO send messages from database in place of empty array
            }
        })
        if(!isInTeam) {
            console.log("Not in team");
            socket.disconnect();
        }
    } catch(err) {
        console.log(err)
        socket.disconnect();
    }
})
