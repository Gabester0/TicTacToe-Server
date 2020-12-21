# Tic Tac Toe

[Tic Tac Toe]('./')

## Built with:

#### Client

- React
- Styled Components
- React-Spring

#### Server

- Node.js
- Express
- Socket.io
- Redis

## About:

> Tic Tac Toe game that supports playing on a shared screen or against a random opponent online. The project originated as a simple Tic Tac Toe game with a single React front-end only where players shared a computer and took turns using the mouse. I built this in about 4 hours as a challenge while attending the [Full-Stack-Dojo](https://www.meetup.com/Full-Stack-Dev-Factory/) meetup. I later incorporated React-Spring to create a confetti cannon animation when a player won a game.

> This year, 2020, I have been learning Node.js, Express, and Socket.io and I wanted to incorporate a server into this project allow different players to connect for a game of Tic Tac Toe. I built an Express server using Socket.io for rapid server-client communication. Because my primary focus was creating a full-stack website with basic game functionality and exploring more complex uses of Socket.io I chose to use Redis as a temporary data-store during each game.

> Each connection from Socket.io is connectd to a socket room with only 1 player or added to a new room to wait for a second player. All of the game state exists in Redis and is emitted to the room when it is updated.

---

## To Run Server Locally

### Start Redis Server and Redis CLI on Windows

1.  If not installed, install Redis from [https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/](https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/)
2.  Start Redis Server:
    > a) - navigate to the server folder with `cd server`
    > b) - Navigate to the folder where you installed redis. Ex: `cd ../../../../Programs/redis-2.4.5-win32-win64/64bit`
    > c) - And enter `redis-server` to start the server
    > d) - Leave this terminal open until you wish to shut down the server with CTRL + C and enter `y`
3.  Open new terminal window
4.  Repeat steps 2a and 2b
5.  Enter `redis-cli` to open the redis CLI
    > Now you can use `get [key-name]` to access any redis variables you set

### Start the Server

1.  Create a .env file in the root server directory and add `PORT=5005`
2.  In a new terminal window navigate to server folder with `cd server`
3.  Install node modules with `yarn`
4.  Enter `yarn run start` to start server

---

## Redis-CLI commands

- To empty the redis db enter `flushdb`
- To see a value enter `get [key-name]`
  > - A string with all the current games is stored under `games`
  > - Games are represented by a comma separated string of incrementing integers starting at 1
  > - To see all games enter `get games` (When in doubt, for testing purposes, the latest/highest game will be the current game)
  > - Game specific values are named using the structure `game#.value-name`
  > - To retrieve the list of player x's moves for game 1 enter `get 1.xMoves`
- To stop redis server press CTRL + C and enter Y

---

## Remaining goals:

### - Pre-Deployment Items:

##### - Client

> - Update & uncomment line 15 of index.html with url of front-end
> - Update line 10 of RandomGame.js with url of deployed server
> - Updated line 3 of this README file with URL of deployed client

##### - Server

> - Comment out line 1 of server.js pre-deployment
