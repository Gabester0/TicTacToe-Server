const { redisClient } = require('../redis/redis');

let noGames = true;

const findGame = async (socket, io)=>{
   if(noGames){    //Handle Creating First Game
      noGames = false
      const games = JSON.stringify([1]);
      await redisClient.setAsync('games', games)
      const gameStatus = { game: 1, status: false };
      await redisClient.setAsync(`1`, JSON.stringify(gameStatus)) //Set A Game status of false because only one player has joined
      socket.join(`1`)
      socket.emit("join", { ...gameStatus, player: `X`, note: `This is game #${1} and player X has joined the game.  Waiting for a second player`}) //Communicate to first client Game number and player (X)
      return gameStatus
   }else {    //Handle adding second player, or creating additional games

      const gamesJSON = await redisClient.getAsync('games');
      const games = JSON.parse(gamesJSON);
      console.log(`findGame.js line 19`, games)
      const latestGame = games[games.length - 1]
      const latestGameStateJSON = await redisClient.getAsync(`${latestGame}`)
      const latestGameState = JSON.parse(latestGameStateJSON)

      if(latestGameState.status === false){    //Add Player to existing Game
         socket.join(`${latestGame}`)
         const updatedLatestGameState = { ...latestGameState, status: true}
         await redisClient.setAsync(`${latestGame}`, JSON.stringify(updatedLatestGameState))
         socket.emit("join", { ...updatedLatestGameState, player: `O`, note: ``}) //Communicate to second player Game number and player (O)
         return updatedLatestGameState

      } else {    //Handle creating new games after the first new game

         const newGame = parseInt(latestGame) + 1
         const updatedGames = [ ...games, newGame]
         const updatedGamesJSON = JSON.stringify(updatedGames)
         await redisClient.setAsync('games', updatedGamesJSON)

         const newGameState = { game: newGame, status: false};
         await redisClient.setAsync(`${newGame}`, JSON.stringify(newGameState)) //Set A Game status of false because only one player has joined
         socket.join(`${newGame}`)
         socket.emit("join", { ...newGameState, player: `X`, note: `This is game #${newGame} and player X has joined the game.  Waiting for a second player`}) //Communicate to first client Game number and player (X)
         return newGameState
      }
   }
}

module.exports = { findGame };