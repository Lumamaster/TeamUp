const express = require('express');
const app = express();
const login = require('./routes/login');
const signup = require('./routes/signup');
const port = process.env.PORT || 8000;

app.use('/login',login);
app.use('/signup',signup);
app.listen(port, () => console.log(`Server running on port ${port}`));