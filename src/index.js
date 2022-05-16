require('dotenv').config();
const express = require('express')
const router = require('./api/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./api/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api', router);
app.use(errorMiddleware);


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