const {CustomError} = require('./../classes');
const {Error: {ValidationError, CastError}} = require('mongoose');


function errorHandler (err, req, res, next) {
  let status = 500;
  let message = err.message ?? 'Something went wrong';

  console.log(err instanceof CustomError);

  if ( err instanceof CustomError ) {
    status = err.status;
    message = err.message;
  } else if ( err instanceof CastError ) {
    if ( err.kind === 'ObjectId' ) {
      message = 'Invalid id';
      status = 400;
    }
  } else if (err instanceof ValidationError) {
    console.log('start');
    console.log(err);
    console.log('end');
  }

  return res.status(status).json({ok: false, message});
}

module.exports = errorHandler;
