const express = require("express")
const router = express.Router()
const jwt = require("jwt")
const User = require("../db")
const {JWT_SECRET} = require("../config")
const zod = require("zod")

module.exports = router

const signupBody = {
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string().min(2).max(6).regex(/0-9/,"Password should contain atleast one number").regex(/A-Z/,"Password should contain atleast one UpperCase").regex(/[!@#$%^&*:;<>,.?|]/,"Password should contain atleast one special character")
}

router.post('/signup',async function(req,res){
   const{success} = signupBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            msg : "Inputs are invalid"
        })   
   }

   const existingUser = User.findOne({
    username : req.body.username
   })

   if(existingUser){
    res.status(411).json({
        msg : "User exists"
    })

    const user = await User.create({
        username : req.body.username,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : req.body.password
    })

    const userId = user._id

    const token = jwt.sign({userId}, JWT_SECRET)

    res.json({
        msg : "User created successfully",
        token : token
    })
   }
})
   const signinBody = zod.object({
    username : zod.string().min(2).email(),
    password : zod.string().min(6).regex(/[!@#$%^&*:;<>,.?]/,"Password must include atleast one special charater").regex(/0-9/,"Password must include atleast one number").regex(/A-Z/,"Password must contain atleast one Uppercase letter")
   })
   router.post('/signin', function(req,res){
      const {success} = signinBody.safeParse(req.body)

      if(!success){
        res.status(411).json({
            msg : "Invalid Username or password"
        })
      }

      const user = User.findOne({
        username : req.body.username,
        password : req.body.password
      })

      if(!user){
        res.status(411).json({
            msg : "No user found"
        })

        if(user){
            const token = jwt.sign({
                userId : user._id
            },JWT_SECRET)
        }

        res.json({
            token : token
        })

        res.status(411).json({
            msg : "Error while logging in"
        })
      }
   })

