const { postGames, getAllGame } = require('../controllers/gamesController')
const gamesRouter = require('express').Router()
gamesRouter.post('/getGames', postGames)
gamesRouter.get('/', getAllGame)
module.exports = gamesRouter
