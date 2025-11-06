const mongoose = require('mongoose')
const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    price: { type: Number, required: false, min: 0 },
    stock: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true,
    collection: 'games'
  }
)
const Game = mongoose.model('games', gameSchema, 'games')
module.exports = Game
