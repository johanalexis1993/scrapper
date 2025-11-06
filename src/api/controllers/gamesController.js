const Game = require('../models/gamesModel')
const games = require('../../../games.json')
const { AppError } = require('../../errors/AppError')
const { mapMongooseError } = require('../../errors/mapMongooseError')
const postGames = async (req, res, next) => {
  try {
    if (!Array.isArray(games) || games.length === 0) {
      throw AppError.badRequest('No games to insert', { file: 'games.json' })
    }
    await Game.insertMany(games, { ordered: false })
    res.status(201).json({ message: 'All games added to the database' })
  } catch (err) {
    const mapped = mapMongooseError(err)
    next(mapped)
  }
}
const getAllGame = async (req, res, next) => {
  try {
    const allGames = await Game.find().lean().exec()
    res.status(200).json(allGames)
  } catch (err) {
    next(mapMongooseError(err))
  }
}
module.exports = { postGames, getAllGame }
