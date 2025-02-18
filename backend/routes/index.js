const express = require("express")
import userRouter from './user'
const cors = require("cors")

app.use(cors())
app.use(express.json())
const router = express.Router()

router.use('/user', userRouter)
app.listen(3000)

module.exports = Router