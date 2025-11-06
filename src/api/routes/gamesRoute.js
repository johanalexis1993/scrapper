const router = require('express').Router()
const { asyncHandler } = require('../../middleware/asyncHandler')
const { postGames, getAllGame } = require('../controllers/gamesController')
router.post('/getGames', asyncHandler(postGames))
router.get('/', asyncHandler(getAllGame))
module.exports = router
