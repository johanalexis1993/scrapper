const { AppError } = require('../errors/AppError')
function assert(condition, message = 'Bad Request', details) {
  if (!condition) throw AppError.badRequest(message, details)
}
module.exports = { assert }
