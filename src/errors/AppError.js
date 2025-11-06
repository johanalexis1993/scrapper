class AppError extends Error {
  constructor(
    message,
    {
      statusCode = 500,
      code = 'INTERNAL_ERROR',
      details = null,
      cause = null
    } = {}
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true
    if (cause) this.cause = cause
    Error.captureStackTrace?.(this, this.constructor)
  }
  static badRequest(message = 'Bad Request', details) {
    return new AppError(message, {
      statusCode: 400,
      code: 'BAD_REQUEST',
      details
    })
  }
  static notFound(message = 'Not Found', details) {
    return new AppError(message, {
      statusCode: 404,
      code: 'NOT_FOUND',
      details
    })
  }
  static conflict(message = 'Conflict', details) {
    return new AppError(message, { statusCode: 409, code: 'CONFLICT', details })
  }
  static unauthorized(message = 'Unauthorized', details) {
    return new AppError(message, {
      statusCode: 401,
      code: 'UNAUTHORIZED',
      details
    })
  }
  static forbidden(message = 'Forbidden', details) {
    return new AppError(message, {
      statusCode: 403,
      code: 'FORBIDDEN',
      details
    })
  }
  static internal(message = 'Internal Server Error', details) {
    return new AppError(message, {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      details
    })
  }
}
module.exports = { AppError }
