const { AppError } = require('./AppError')
function mapMongooseError(err) {
  if (err?.name === 'ValidationError') {
    const fields = Object.keys(err.errors || {}).map((k) => ({
      field: k,
      message: err.errors[k]?.message || 'Invalid value'
    }))
    return new AppError('Validation failed', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: { fields }
    })
  }
  if (err?.name === 'MongoServerError' && err.code === 11000) {
    return AppError.conflict('Duplicate key', { keyValue: err.keyValue })
  }
  if (err?.name === 'CastError') {
    return AppError.badRequest(`Invalid ${err?.path || 'parameter'}`, {
      value: err?.value
    })
  }
  return AppError.internal('Database error', { original: err?.message })
}
module.exports = { mapMongooseError }
