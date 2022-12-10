// require(`dotenv`).config();
const app = require('express')();
const server = require('http').createServer(app);

const session = require('express-session');
const io = require('socket.io')(server, {
   allowEIO3: true,
   cors: {
      origin: "https://eipper-tictactoe.netlify.app/",
      methods: ["GET", "POST"],
      credentials: true,
      maxHttpBufferSize: 1e9
   }
});
const { redisClient, RedisStore } = require('./redis/redis');

const { initiateBoard } = require('./gameLogic/board');
const { findGame } = require('./gameLogic/findGame');
const { handleClick, checkWinner, changeTurn } = require('./gameLogic/gamePlay');

app.use(
   session({
      store: new RedisStore({client: redisClient}),
      secret: 'catsRCool',
      resave: false,
      saveUninitialized: true
   })
)

io.on('connection', async (socket) => { 
   console.log(`Socket Connected`, socket.id)

   const { game, status } = await findGame(socket, io)
   console.log(`SERVER.js line 32`, game, status)
   if(status){
      const initialGame = await initiateBoard(game)
      console.log(`emitting start, `, initialGame)
      io.to(game).emit(`start`, initialGame)
   }

   socket.on('click', async ({ game, client, click })=>{
      const firstGameState = await handleClick(game, client, click)
      currentMoves = client === `X` ? firstGameState.xMoves : firstGameState.oMoves
      const secondGameState = await checkWinner(firstGameState, currentMoves)
      if(secondGameState.winner) console.log(`The winner is ${client}!  With the winning moves:`, secondGameState.match)

      if(secondGameState.winner || secondGameState.draw){
         io.to(game).emit(`gameOver`, secondGameState)
      } else {
         const finalGameState = await changeTurn(client, secondGameState)
         io.to(game).emit(`clicked`, finalGameState)
      }
   })

   socket.on(`initiatePlayAgain`, async({currentGame, client})=>{
      socket.leave(currentGame)
      const { game, status } = await findGame(socket, io)
      console.log(`server.js line 56`, game, status)
      if(status){
         const initialGame = await initiateBoard(game)
         io.to(game).emit(`start`, initialGame)
      }
   })

   socket.on(`quit`, async ({ game })=>{
      console.log(`Quit Event`)
      const gameStateJSON = await redisClient.getAsync(`${game}`)
      const gameState = JSON.parse(gameStateJSON);
      if( !gameState.winner && !gameState.draw ) socket.to(game).emit(`quit`, game)
      if( !gameState.status ){
         const newGameState = JSON.stringify( { ...gameState, status: true } )
         await redisClient.setAsync(`${game}`, newGameState)
      }
   })
 });

const port = process.env.PORT || "8080";

server.listen(port, ()=> console.log(`Server is listening on ${port}`));