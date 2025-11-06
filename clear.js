require('dotenv').config()
const mongoose = require('mongoose')
const Game = require('./src/api/models/gamesModel')
const { connectDB } = require('./src/config/db')
function maskMongoURI(uri = '') {
  return uri.replace(/(mongodb(\+srv)?:\/\/)([^@]+)@/i, (_, p, _srv, creds) => {
    const user = creds.split(':')[0] || 'user'
    return `${p}${user}:****@`
  })
}
;(async function clearDB() {
  try {
    const uri = process.env.DB_URL
    if (!uri) throw new Error('DB_URL no está definido en .env')
    console.log('[clear] DB_URL =>', maskMongoURI(uri))
    await connectDB()
    console.log('[clear] conectado:', {
      host: mongoose.connection.host,
      db: mongoose.connection.name
    })
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(
      '[clear] colecciones:',
      collections.map((c) => c.name)
    )
    const dropAll = process.argv.includes('--drop')
    if (dropAll) {
      await mongoose.connection.dropDatabase()
      console.log(
        `[clear] dropDatabase() ejecutado sobre "${mongoose.connection.name}"`
      )
      await mongoose.disconnect()
      process.exit(0)
    }
    const before = await Game.estimatedDocumentCount()
    console.log(`[clear] games antes = ${before}`)
    const res = await Game.deleteMany({})
    const after = await Game.estimatedDocumentCount()
    console.log(
      `[clear] deleteMany => deleted=${res.deletedCount} | games después=${after}`
    )
    if (after > 0) {
      console.warn(
        '[clear] OJO: aún quedan documentos en "games". Revisa el nombre de la colección o el modelo.'
      )
    }
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('[clear] Error:', err?.message)
    process.exit(1)
  }
})()
