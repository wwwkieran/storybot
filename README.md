# StoryBot

### Architecture

This repo has two components: client and server. 
The server is a simple websocket server which contains the game logic for StoryBot. 
The client is a React web app which runs on each player's machine and connects to the server for gameplay. 

### How to Run
#### Setup 
###### Server
You must set up an `OPENAI_API_KEY` environment variable on your system. Instructions [here](https://platform.openai.com/docs/quickstart). 
```
cd ./server
npm i 
```
###### Client 
```
cd ./client
npm i 
```
#### Start 
###### Server
```
cd ./server
npm run start
```
###### Client
```
cd ./client
npm run start
```
The server will start on port 8081. On the client, you will type in `<your_ip>:8081` as the server. 