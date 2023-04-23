const { redisClient } = require('../redis/redis');

let noGames = true;
// TODO: Figure out how we are getting games with no status
const findGame = async (socket, io)=>{
   if(noGames){    //Handle Creating First Game
      noGames = false
      const games = JSON.stringify([1]);
      await redisClient.set('games', games)
      const gameStatus = { game: 1, status: false };
      await redisClient.set(`1`, JSON.stringify(gameStatus)) //Set A Game status of false because only one player has joined
      socket.join(`1`)
      socket.emit("join", { ...gameStatus, player: `X`, note: `This is game #${1} and player X has joined the game.  Waiting for a second player`}) //Communicate to first client Game number and player (X)
      return gameStatus
   }else {    //Handle adding second player, or creating additional games
      const gamesJSON = await redisClient.get('games');
      const games = JSON.parse(gamesJSON);
      console.log({games})
      const latestGame = games[games.length - 1]
      const latestGameStateJSON = await redisClient.get(`${latestGame}`)
      const latestGameState = JSON.parse(latestGameStateJSON)
console.log({latestGameState})
      if(latestGameState.status === false){    //Add Player to existing Game
         socket.join(`${latestGame}`)
         const updatedLatestGameState = { ...latestGameState, status: true}
         await redisClient.set(`${latestGame}`, JSON.stringify(updatedLatestGameState))
         socket.emit("join", { ...updatedLatestGameState, player: `O`, note: `This is game #${latestGame} and player O has joined the game.  Ready to play`}) //Communicate to second player Game number and player (O)
         return updatedLatestGameState

      } else {    //Handle creating new games after the first new game

         const newGame = parseInt(latestGame) + 1
         const updatedGames = [ ...games, newGame]
         const updatedGamesJSON = JSON.stringify(updatedGames)
         await redisClient.set('games', updatedGamesJSON)

         const newGameState = { game: newGame, status: false};
         await redisClient.set(`${newGame}`, JSON.stringify(newGameState)) //Set A Game status of false because only one player has joined
         socket.join(`${newGame}`)
         socket.emit("join", { ...newGameState, player: `X`, note: `This is game #${newGame} and player X has joined the game.  Waiting for a second player`}) //Communicate to first client Game number and player (X)
         return newGameState
      }
   }
}

module.exports = { findGame };