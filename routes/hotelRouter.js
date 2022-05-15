const express = require("express");
const HotelController = require("../controllers/hotelController");

const router = express.Router()

router.get('/', HotelController.getAllHotels)

module.exports = router;