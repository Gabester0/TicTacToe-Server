const { redisClient } = require('../redis/redis');
const { solutions } = require('../gameLogic/static')

const handleClick = async (game, client, click)=>{
    const gameStateJSON = await redisClient.get(`${game}`)
    const gameState = JSON.parse(gameStateJSON)

    const currentPlayerMoves = client === `X` ? gameState.xMoves : gameState.oMoves;
    const otherPlayerMoves =  client === `X` ? gameState.oMoves : gameState.xMoves

    //Add a check to ensure current player has less than or equal to the number of moves of the other player
    if(currentPlayerMoves.length <= otherPlayerMoves.length){
        const curr = parseInt(click);
        if(gameState.board[curr] === null && !gameState.winner){
            await redisClient.set(`${game}.lastMove`, curr)
            const updatedBoard = { ...gameState.board, [curr]: client }

            if(client === "X"){
                const updatedXMoves = [...gameState.xMoves, curr]
                // const updatedXMovesJSON = JSON.stringify(updatedXMoves)
                const updatedGameState = { ...gameState, board: updatedBoard, xMoves: updatedXMoves}
                const updatedGameStateJSON = JSON.stringify(updatedGameState)
                await redisClient.set(`${game}`, updatedGameStateJSON)
                return updatedGameState
            } else {
                const updatedOMoves = [...gameState.oMoves, curr]
                // const updatedOMovesJSON = JSON.stringify(updatedOMoves)
                const updatedGameState = { ...gameState, board: updatedBoard, oMoves: updatedOMoves}
                const updatedGameStateJSON = JSON.stringify(updatedGameState)
                await redisClient.set(`${game}`, updatedGameStateJSON)
                return updatedGameState
            }
        }
    }
}

const checkWinner = async (gameState, currentMoves)=>{
    if(currentMoves.length < 3) return gameState
    // Update draw
    const draw = gameState.oMoves.length + gameState.xMoves.length === 9;
    if(draw){
        const updatedGameState = { ...gameState, draw }
        const updatedGameStateJSON = JSON.stringify(updatedGameState)
        await redisClient.set(`${gameState.game}`, updatedGameStateJSON)
        return updatedGameState
    } else {
        // currentMoves (xMoves or oMoves), 
        for(let i =  0; i < solutions.length; i++){
            let match = currentMoves.filter((e)=> solutions[i].includes(e));
            if( match.length === 3 ){
                const updatedGameState = { ...gameState, winner: true, match }
                const updatedGameStateJSON = JSON.stringify(updatedGameState)
                await redisClient.set(`${gameState.game}`, updatedGameStateJSON)
                return updatedGameState
            }
        }
        //If no match found this return statement executes & returns winner, draw, and match unchanged
        return gameState
    }
}

const changeTurn = async (client, gameState)=>{
    // Update player
    const player = client === `X` ? `O` : `X`;
    const updatedGameState = { ...gameState, player }
    const updatedGameStateJSON = JSON.stringify(updatedGameState);
    await redisClient.set(`${gameState.game}`, updatedGameStateJSON)
    return updatedGameState
}

module.exports = { handleClick, checkWinner, changeTurn }