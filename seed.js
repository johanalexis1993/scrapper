require('dotenv').config()
const fs = require('fs')
const path = require('path')
const Game = require('./src/api/models/gamesModel')
const { connectDB } = require('./src/config/db')
async function seedFromJson(filePath) {
  const abs = path.resolve(filePath)
  if (!fs.existsSync(abs)) {
    console.warn(`[seed] No existe ${abs}. Me salto el seed.`)
    return
  }
  const raw = JSON.parse(fs.readFileSync(abs, 'utf8'))
  const items = Array.isArray(raw) ? raw : raw.results || []
  if (!items.length) {
    console.warn('[seed] games.json está vacío. Nada que insertar.')
    return
  }
  const ops = items
    .filter((g) => g && g.title)
    .map((g) => ({
      updateOne: {
        filter: { title: g.title },
        update: { $set: { ...g } },
        upsert: true
      }
    }))
  if (!ops.length) {
    console.warn('[seed] No hay ítems válidos con "title".')
    return
  }
  console.log(`[seed] items: ${items.length}, ops: ${ops.length}`)
  try {
    const res = await Game.bulkWrite(ops, { ordered: false })
    const modifiedCount = res.modifiedCount || 0
    const upsertedCount = res.upsertedCount || 0
    const matchedCount = res.matchedCount || 0
    console.log(
      `[seed] OK → upserts: ${upsertedCount}, modificados: ${modifiedCount}, coincidentes: ${matchedCount}`
    )
  } catch (err) {
    console.error('[seed] Error en bulkWrite:', err.message)
    throw err
  }
}
async function runSeed() {
  await connectDB()
  await seedFromJson('games.json')
}
module.exports = { runSeed, seedFromJson }
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[seed] Error fatal:', err)
      process.exit(1)
    })
}
