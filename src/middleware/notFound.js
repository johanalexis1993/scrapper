const { AppError } = require('../errors/AppError')
function notFound(req, res, next) {
  next(AppError.notFound(`Route ${req.originalUrl} not found`))
}
module.exports = { notFound }
