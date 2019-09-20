const express = require('express');
const app = express();
const login = require('./routes/login');
const signup = require('./routes/signup');
const viewProfile = require('./routes/viewprofile');
const removeTeam = require('./routes/leaveTeam');
const editProfile = require('./routes/editProfile');
const searchUser = require('./routes/searchuser');
//const createTeam = require('./routes/createTeam');
//const joinTeam = require('./routes/joinTeam');
const port = process.env.PORT || 8000;

app.use('/login', login);
app.use('/signup', signup);
app.use('/teams/leave', removeTeam);
<<<<<<< HEAD
//app.use('/profile/:id', viewProfile);
app.use('/user/profile/edit', editProfile);
app.use('/search', searchUser);
=======
app.use('/profile', viewProfile);
app.use('/profile/edit', editProfile);
>>>>>>> b7d1a65860888e0cc3b753459a32ee7394fe29e9
//app.use('/teams/create', createTeam);
//app.use('/user/teams/join', joinTeam);
app.listen(port, () => console.log(`Server running on port ${port}`));