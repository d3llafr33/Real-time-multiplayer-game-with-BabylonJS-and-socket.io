# Real-Time Multiplayer Game using BabylonJS, socket.io, NodeJS
Real-Time Multiplayer Game using BabylonJS, socket.io, NodeJS      

This is a simple real-time multiplayer game. The goal of the game is quite simple:     
each room contains a maximum of 2 players ; who hits more than half of the balls in the scene, wins.

## Usage
On the project folder, type `node server.js` to starting the server.
Now, do the following steps to start the real-time game:
- open a browser and type `localhost:8001` -> one player created.
- open another tab in the browser and type again `localhost:8001` -> second player created.
- now you have two pages, each of which with 2 players and some spheres. If you move one player, you see, in realt-time, the movement even in the other page and vice versa. You can move the player with the keys WSDA.
When a player hits a ball , this is destroyed and the score is updated. The player who hits more than half of the balls in the scene, wins.

![screenshot](/screenshot.PNG "A simple screen showing the scene with the 2 players")

## Built With

* BabylonJS
* Socket.io
* NodeJS


