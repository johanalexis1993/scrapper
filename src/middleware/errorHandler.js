const { AppError } = require('../errors/AppError')
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)
  const appErr =
    err instanceof AppError
      ? err
      : new AppError('Internal Server Error', {
          statusCode: 500,
          code: 'INTERNAL_ERROR',
          cause: err
        })

  const payload = {
    error: {
      message: appErr.message,
      code: appErr.code,
      ...(appErr.details ? { details: appErr.details } : {})
    }
  }
  const logObj = {
    name: err?.name,
    message: err?.message,
    code: appErr.code,
    status: appErr.statusCode,
    route: `${req.method} ${req.originalUrl}`,
    ...(appErr.cause ? { cause: appErr.cause?.message } : {}),
    stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack
  }
  console.error('[ERROR]', JSON.stringify(logObj, null, 2))
  return res.status(appErr.statusCode).json(payload)
}
module.exports = { errorHandler }
