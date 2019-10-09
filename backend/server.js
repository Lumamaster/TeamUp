const express = require('express');
const app = express();
const cors = require('cors');
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
app.listen(port, () => console.log(`Server running on port ${port}`));