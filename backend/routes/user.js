const express = require("express")
const router = express.Router()
const jwt = require("jwt")
const User = require("../db")
const {JWT_SECRET} = require("../config")
const zod = require("zod")
const authMiddleware = require("./middleware")

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

   router.use(authMiddleware)

   const updateUser = zod.object({
    password : zod.string().min(6).regex(/0-9/,"Password must inclulde a number").regex(/A-Z/,"Password must contain atleast one Uppercase character").regex(/[!@#$%^&*:;<>,.?]/,"Password must contain atleast one special character").optional(),
    lastName : zod.string().min(2).optional(),
    firstName : zod.string().min(2).optional()
   })

   router.put('/update',async function(req,res){
      const{success} = updateUser.safeParse(req.body)

      if(!success){
        res.status(404).json({
            msg : "Error while updating information"
        })
      }

      await User.updateOne({_id:req.userId},req.body)

      res.json({
        msg : "Updated successfullyy"
      })

   })