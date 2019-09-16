const express = require('express');
const router = express.Router();
const loginUser = require('../loginuser');

router.use(express.json());
router.post('/', (req,res) => {
    console.log(req.body);
    const {email, password} = req.body;
    if(!email || !password) res.sendStatus(400);
    res.sendStatus(loginUser(email, password) ? 200 : 404)
})

module.exports = router;