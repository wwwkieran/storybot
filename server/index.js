const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const players = {}; 
const messages = [];
const player_names = []; 


// Function to get the next player
function getNextPlayer(currentPlayer) {
    const currentIndex = player_names.indexOf(currentPlayer); // Find the index of the current key

    if (currentIndex === -1) {
        return null; // Current key does not exist
    }

    const nextIndex = currentIndex + 1; // Get the next index
    if (nextIndex < player_names.length) {
        return player_names[nextIndex]; 
    }

    return -1;
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function getAISentence() {

}


server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            // Handle different types of messages
            switch(data.type){
                case "ENTER_PLAYER":
                    //setting the player_name within the websocket to be equal to the player_name in the data
                    ws.player_name = data.player_name; 
                    // in dictionary of players, the key is the player name, and the value is the websocket
                    players[ws.player_name] = ws; 

                    for (const name in players){
                        players[name].send(JSON.stringify({
                            type: "CURRENT_PLAYERS",
                            player_names: Object.keys(players)
                            }));
                        }
                    break; 

                case "GAME_START":
            
                    //creates an array of all the names of the players and then shuffles that names array 
                    const names = Object.keys(players);
                    shuffleArray(names); 
                    
                    //iterate through shuffled list of names and then send trigger_start message
                    //while iterating through shuffled list of names, also append that new order onto global player_names array
                    for (const name of names){
                        players[name].send(JSON.stringify({
                            type: "TRIGGER_START",
                            player_names: Object.keys(players)
                            }));
                        player_names.append(name); 
                    }
                    
                    //send the your_turn message to the new first player from the array 
                    const first_player = player_names[0]; 
                    players[first_player].send(JSON.stringify({
                        type: "YOUR_TURN"
                    }));
                    break; 
                
                case "USER_SUBMITTED":
                    //creating a message object that stores name and sentence and appending to list of messages 

                    const message = {
                        "name": data.player_name,
                        "sentence": data.sentence
                    };
                    messages.append(message)

                    //getting key of current player and setting new player 
                    let next_player = getNextPlayer(data.player_name)

                    if (next_player === -1) {
                        for (const name in players){
                            players[name].send(JSON.stringify({
                                type:"GAME_ENDED",
                                story : messages
                            }));
                        }
                    } else {
                        if (next_player === "AI") {
                            getAISentence()
                            next_player = getNextPlayer(next_player)
                        }
                        players[next_player].send(JSON.stringify({
                            type: "YOUR_TURN",
                            last_message: messages[messages.length - 1]
                        }));
                    }
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');