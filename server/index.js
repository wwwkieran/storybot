require('dotenv').config();
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8081 });
const players = {}; 
let messages = [];
let player_names = [];

// AI Configuration
const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

// Validate OpenAI API Key
if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is not set in the environment variables.');
    process.exit(1);
}

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

function getLastThreeWords(input) {
    if (!input.trim()) {
        return "";
    }

    const words = input.trim().split(/\s+/);
    const lastThreeWords = words.slice(-3);
    return lastThreeWords.join(" ");
}

async function getAISentence() {
    // Get the last message from messages
    const lastSentence = messages.length > 0 ? messages[messages.length - 1].sentence : '';

    const lastWords = getLastThreeWords(lastSentence)
    // Get AI completion
    const aiSentence = await getAICompletion(lastWords);
    
    if (aiSentence) {
        const aiMessage = {
            "name": "AI",
            "sentence": aiSentence
        };
        messages.push(aiMessage); // Use push instead of append

        // Broadcast AI's message to all players
        for (const name in players){
            players[name].send(JSON.stringify({
                type: "USER_SUBMITTED",
                message: aiMessage
            }));
        }
        console.log(`AI submitted: "${aiSentence}"`);
        
        // Get next player after AI
        let next_player = getNextPlayer("AI");
        if (next_player === -1) {
            // Game ends
            for (const name in players){
                players[name].send(JSON.stringify({
                    type:"GAME_ENDED",
                    story : messages
                }));
            }
        } else {
            players[next_player].send(JSON.stringify({
                type: "YOUR_TURN",
                last_message: messages[messages.length - 1]
            }));
        }
    } else {
        console.log("AI failed to generate a message.");
        // Optionally, you could skip AI's turn or handle it differently
    }
}

// Function to fetch AI completion from OpenAI
async function getAICompletion(lastWords) {
    const aiMessages = [
        {
            role: 'user',
            content: `We are playing a game. You are a human being and receive the LAST_WORDS of a STORY. 
                      I need you to follow up this STORY with 5 to 20 words. If the LAST_WORDS doesn't have a period at the end, continue the sentence and you can create more sentences as well. Only share the text with no explanation or quotation marks. Make it casual or funny, and sound like a 20-year-old human. Additionally, set a variable n to be randomly either 0 or 1. If the value of n is 0, then end the sentence that you generate to be closed, and if n is equal to 1, then do not close the sentence that you generate. 
                      LAST_WORDS: ${lastWords}`,
        },
    ];

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Ensure you're using a valid model
                messages: aiMessages,
                max_tokens: 50,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content.trim();
        console.log(`AI Generated Message: "${aiMessage}"`);
        return aiMessage;
    } catch (error) {
        console.error('Error fetching completion from OpenAI:', error);
        return null;
    }
}

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            // Handle different types of messages
            switch (data.type) {
                case "ENTER_PLAYER":
                    //setting the player_name within the websocket to be equal to the player_name in the data
                    ws.player_name = data.player_name;
                    // in dictionary of players, the key is the player name, and the value is the websocket
                    players[ws.player_name] = ws;

                    for (const name in players) {
                        players[name].send(JSON.stringify({
                            type: "CURRENT_PLAYERS",
                            player_names: Object.keys(players)
                        }));
                    }
                    break;

                case "GAME_START":

                    //creates an array of all the names of the players and then shuffles that names array 
                    player_names = Object.keys(players)
                    player_names.push("AI")
                    shuffleArray(player_names);

                    messages = [];

                    //iterate through shuffled list of names and then send trigger_start message
                    //while iterating through shuffled list of names, also append that new order onto global player_names array
                    for (const name in players) {
                        players[name].send(JSON.stringify({
                            type: "TRIGGER_START",
                            player_names: Object.keys(players)
                        }));
                    }

                    //send the your_turn message to the new first player from the array 
                    let first_player = player_names[0];
                    if (first_player === "AI") {
                        await getAISentence()
                        first_player = getNextPlayer(first_player)
                    }
                    players[first_player].send(JSON.stringify({
                        type: "YOUR_TURN",
                        last_message: {
                            sentence: ""
                        }
                    }));

                    break;

                case "USER_SUBMITTED":
                    //creating a message object that stores name and sentence and appending to list of messages 

                    const message = {
                        "name": data.player_name,
                        "sentence": data.sentence
                    };
                    messages.push(message)

                    //getting key of current player and setting new player 
                    let next_player = getNextPlayer(data.player_name)

                    if (next_player === -1) {
                        for (const name in players) {
                            players[name].send(JSON.stringify({
                                type: "GAME_ENDED",
                                story: messages
                            }));
                        }

                    } else {
                        if (next_player === "AI") {
                            await getAISentence()
                            next_player = getNextPlayer(next_player)
                            if (next_player === -1) {
                                for (const name in players) {
                                    players[name].send(JSON.stringify({
                                        type: "GAME_ENDED",
                                        story: messages
                                    }));
                                }
                                break
                            }
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
            ws.send(JSON.stringify({type: 'error', message: 'Invalid JSON'}));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        delete players[ws.player_name]
    });
});

console.log('WebSocket server is running on ws://localhost:8081');