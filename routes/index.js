const express = require("express")
const hotelRouter = require("./hotelRouter");

const router = express.Router()

router.use('/hotel', hotelRouter)

module.exports = router;