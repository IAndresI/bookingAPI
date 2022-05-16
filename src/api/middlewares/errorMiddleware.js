const ApiError = require('../helpers/apiError');

module.exports = (err, req, res, next) => {
  console.log(err);
  if(err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }
  return res.status(500).json({message: "UNHANDLED ERROR: "+err.message});
}