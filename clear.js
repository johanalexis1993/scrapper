require('dotenv').config()
const Game = require('./src/api/models/gamesModel')
const { connectDB } = require('./src/config/db')
async function clearDB() {
  try {
    await connectDB()
    const res = await Game.deleteMany({})
    console.log(
      `[clear] Eliminados ${res.deletedCount} documentos de la colección "games".`
    )
  } catch (err) {
    console.error('[clear] Error al eliminar:', err.message)
    process.exit(1)
  }
}
if (require.main === module) {
  clearDB()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[clear] Error fatal:', err)
      process.exit(1)
    })
}
