const { redisClient } = require('../redis/redis');
const { emptyBoard } = require('./static')


const initiateBoard = async(game)=>{
    const gameState = {
        game,
        board: emptyBoard,
        player: `X`,
        winner: false,
        draw: false,
        lastMove: ``,
        xMoves: [],
        oMoves: [],
        match: []
    }
    const gameStateJSON = JSON.stringify(gameState)
    await redisClient.set(game, gameStateJSON)
    return gameState
}

module.exports = { initiateBoard };