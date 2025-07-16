const express = require('express')
const router = express.Router()
const zod  = require('zod')
const {User} = require('./../../db')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('./../config')

module.exports = router

const signupbody = zod.object({
    username : zod.string().email(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

router.post('signup',async(req,res) => {
    const {success} = signupbody.safeParse(req.body)
    if(!success){
        res.status(400).json({
            msg : "invalid inputs"
        })
    }

    const existingUser = await User.findOne({
        username : req.body.username
    })

    if(existingUser){
        res.status(411).send({
            msg : "username already exits"
        })
    }

    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    })

    const userId = user._id 

    const token = jwt.sign({userId},JWT_SECRET)

    res.json({
        msg : "user created successfully",
        token : token
    })
}
)
