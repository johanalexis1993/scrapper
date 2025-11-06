require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const gamesRouter = require('./src/api/routes/gamesRoute')
const { notFound } = require('./src/middleware/notFound')
const { errorHandler } = require('./src/middleware/errorHandler')
const app = express()
app.use(express.json())
connectDB()
  .then(() => {
    app.use('/api/v1/games', gamesRouter)
    app.use('*', notFound)
    app.use(errorHandler)
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () =>
      console.log(`Server ready on http://localhost:${PORT}`)
    )
  })
  .catch((err) => {
    console.error('[boot] Fatal:', err?.message)
    process.exit(1)
  })
