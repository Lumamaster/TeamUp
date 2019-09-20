const express = require('express');
const app = express();
const login = require('./routes/login');
const signup = require('./routes/signup');
const viewProfile = require('./routes/viewprofile');
const removeTeam = require('./routes/leaveTeam');
const editProfile = require('./routes/editProfile');
<<<<<<< HEAD
const startTeam = require('./routes/startteam');
=======
const listTeams = require('./routes/listteams');
>>>>>>> 4025138c62398d3c29bce46e0f5e90eaec3c38e8
//const createTeam = require('./routes/createTeam');
//const joinTeam = require('./routes/joinTeam');
const port = process.env.PORT || 8000;

app.use('/login', login);
app.use('/signup', signup);
app.use('/teams/leave', removeTeam);
app.use('/teams', listTeams);
app.use('/profile', viewProfile);
app.use('/profile/edit', editProfile);
app.use('/startteam',startTeam);
//app.use('/teams/create', createTeam);
//app.use('/user/teams/join', joinTeam);
app.listen(port, () => console.log(`Server running on port ${port}`));