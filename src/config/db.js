const mongoose = require('mongoose')
const { AppError } = require('../errors/AppError')
const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw AppError.internal('DB_URL is not configured')
    }
    await mongoose.connect(process.env.DB_URL)
    console.log('[db] Conectado a la base de datos')
    mongoose.connection.on('error', (err) => {
      console.error('[db] runtime error:', err?.message)
    })
  } catch (error) {
    console.error('[db] Error de conexión:', error?.message)
    throw error instanceof AppError
      ? error
      : AppError.internal('Database connection failed', { cause: error })
  }
}
module.exports = { connectDB }
