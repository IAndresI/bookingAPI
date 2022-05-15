class HotelController {
  async getAllHotels(req, res, next) {
    try {
      res.json("Hotel recieved!")
    } catch (error) {
      res.send(404);
    }
  }
}

module.exports = new HotelController();
