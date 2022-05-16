const express = require("express")
const hotelRouter = require("./hotelRouter");
const userRouter = require("./userRouter");

const router = express.Router()

router.use('/hotel', hotelRouter)
router.use('/user', userRouter)

module.exports = router;