require('dotenv').config();
const express = require('express')
const router = require('./routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use('/api', router)
app.use(cors())
app.use(express.json())

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server start on ${PORT} port`);
    })
  }
  catch (err) {
    console.log(err);
  }
}


start();