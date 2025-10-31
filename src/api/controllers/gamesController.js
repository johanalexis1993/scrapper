const Game = require('../models/gamesModel')
const games = require('../../../games.json')
const postGames = async (req, res, next) => {
  try {
    await Game.insertMany(games)
    return res.status(201).json('All Games added to the database!')
  } catch (error) {
    return res.status(400).json(error)
  }
}
const handleErr = (res, error) => {
  console.error(`Ha ocurrido un error: ${error}`)
  return res.status(500).json({ error: error.message, stack: error.stack })
}
const getAllGame = async (req, res, next) => {
  try {
    const allGames = await Game.find()
    return res.status(200).json(allGames)
  } catch (error) {
    handleErr(res, error)
  }
}
module.exports = { postGames, getAllGame }
