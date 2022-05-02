const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./customApi');

class NotAllowedByCORSError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }
}

module.exports = NotAllowedByCORSError;
