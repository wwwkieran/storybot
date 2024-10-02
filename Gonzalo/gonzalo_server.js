// server.js

require('dotenv').config(); // Load environment variables from .env

const WebSocket = require('ws');

const PORT = 8081;
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

// OpenAI Configuration
const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

// Validate API Key
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Game State
let players = [];
let currentPlayerIndex = 0;
let gameStarted = false;
let submissions = []; // Array to store individual submissions
let aiSubmissionIndex = -1; // Index of the AI's submission

// Add AI Player
const aiPlayer = {
  id: 'ai-player',
  name: 'AI',
  isAI: true, // Flag to identify AI player
  ws: null // Will remain null as AI doesn't have a WebSocket connection
};

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Helper function to get last n words from the submissions
function getLastWords(n) {
  const completeText = submissions.map(sub => sub.text).join(' ');
  const words = completeText.trim().split(/\s+/);
  return words.slice(-n).join(' ');
}

// Helper function to broadcast to all players
function broadcast(data) {
  players.forEach(player => {
    if (!player.isAI && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(data));
      console.log(`Broadcasted to ${player.name} (ID: ${player.id}):`, data.type);
    }
  });
}

// Helper function to send to a specific player
function sendToPlayer(player, data) {
  if (!player.isAI && player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(data));
    console.log(`Sent to ${player.name} (ID: ${player.id}):`, data.type);
  }
}

// Function to fetch AI completion from OpenAI
async function getAICompletion(lastWords) {
  const messages = [
    {
      role: 'user',
      content: `We are playing a game. You are a human being and receive the LAST_WORDS of a STORY. 
                  I need you to follow up this STORY with no more than 20 words. If the LAST_WORDS doesn't have a period at the end, continue the sentence and you can create more sentences as well. Only share the text with no explanation or quotation marks. Make it casual or funny, and sound like a 20-year-old human. Additionally, set a variable n to be randomly either 0 or 1. If the value of n is 0, then end the sentence that you generate to be closed, and if n is equal to 1, then do not close the sentence that you generate. 
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
        messages: messages,
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

// Function to start the game
function startGame() {
  if (players.length === 0) {
    console.log("No players to start the game.");
    return;
  }

  gameStarted = true;
  currentPlayerIndex = 0;
  submissions = [];

  // Shuffle players
  shuffle(players);

  // Insert AI player at random position if not already in players
  if (!players.find(p => p.isAI)) {
    const randomIndex = Math.floor(Math.random() * (players.length + 1));
    players.splice(randomIndex, 0, aiPlayer);
  }

  const gameStartMessage = {
    type: "GameStart",
    message: "The game has started!"
  };
  broadcast(gameStartMessage);
  console.log("Game started.");

  sendYourTurn();
}

// Function to notify the current player it's their turn
function sendYourTurn() {
  if (currentPlayerIndex >= players.length) {
    // All turns are done
    endGame();
    return;
  }

  const currentPlayer = players[currentPlayerIndex];

  if (currentPlayer.isAI) {
    sendAIPlayerTurn();
  } else {
    let lastWords = '';
    if (submissions.length > 0) {
      lastWords = getLastWords(3);
    }
    const yourTurnMessage = {
      type: "YourTurn",
      message: "It's your turn to add to the text.",
      lastWords: lastWords
    };
    sendToPlayer(currentPlayer, yourTurnMessage);
    console.log(`It's ${currentPlayer.name}'s turn.`);
  }
}

// Function to handle AI player's turn
async function sendAIPlayerTurn() {
  console.log("AI player is taking its turn.");

  const lastWords = getLastWords(3);
  const aiText = await getAICompletion(lastWords);

  if (aiText) {
    submissions.push({ id: aiPlayer.id, text: aiText });
    aiSubmissionIndex = submissions.length - 1;

    console.log(`AI (${aiPlayer.name}) submitted text: "${aiText}"`);
  } else {
    console.log("AI failed to generate a message.");
  }

  // Notify players that AI has submitted its text
  broadcast({
    type: "UserSubmitted",
    id: aiPlayer.id,
    message: `${aiPlayer.name} has submitted their text.`
  });

  // Move to the next player
  currentPlayerIndex++;
  sendYourTurn();
}

// Function to end the game
function endGame() {
  gameStarted = false;
  // Construct the final text with numbers after each sentence
  let finalText = '';
  submissions.forEach((sub, index) => {
    finalText += sub.text + ` (${index + 1}) `;
  });
  finalText = finalText.trim();

  console.log("Game ended.");

  // Prepare sentences for players to guess
  const sentences = submissions.map((sub, index) => ({
    index: index,
    text: sub.text
  }));

  // No longer shuffle sentences

  // Send the sentences to each player for guessing
  players.forEach(player => {
    if (!player.isAI) {
      sendToPlayer(player, {
        type: "GuessAI",
        message: "Guess which sentence was written by the AI.",
        sentences: sentences
      });
    }
  });

  // Broadcast the complete story in order
  broadcast({
    type: "GameEnded",
    message: "The game has ended! Here's the complete story:",
    completeText: finalText
  });
}

// Function to handle incoming messages
function handleMessage(ws, data) {
  try {
    const message = JSON.parse(data);

    switch (message.type) {
      case "UserJoined":
        // Client to Server: A user has joined
        if (!players.find(p => p.id === message.id)) {
          players.push({ id: message.id, name: message.name, ws: ws, isAI: false });
          console.log(`User joined: ${message.name} (ID: ${message.id})`);
          // Notify all clients
          broadcast({
            type: "UserJoined",
            id: message.id,
            name: message.name
          });
        }
        break;

      case "TriggerStart":
        // Client to Server: A user wants to start the game
        console.log(`Game start triggered by ${message.id}`);
        if (!gameStarted) {
          startGame();
        }
        break;

      case "UserSubmitted":
        // Client to Server: A user has submitted their text
        if (!gameStarted) {
          console.log("Received UserSubmitted but the game hasn't started.");
          return;
        }

        const submittingPlayer = players.find(p => p.id === message.id);
        if (!submittingPlayer) {
          console.log("Submitting player not found:", message.id);
          return;
        }

        if (players[currentPlayerIndex].id !== submittingPlayer.id) {
          console.log(`It's not ${submittingPlayer.name}'s turn.`);
          return;
        }

        const submittedText = message.text;

        // Enforce max 40 words for all players
        const wordCount = submittedText.trim().split(/\s+/).length;
        if (wordCount > 40) {
          // Reject submission
          sendToPlayer(submittingPlayer, {
            type: "Error",
            message: "Your submission exceeds the maximum of 40 words. Please submit a shorter text."
          });
          return;
        }

        // Enforce minimum of 2 sentences
        const sentenceCount = submittedText.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        if (sentenceCount < 2) {
          sendToPlayer(submittingPlayer, {
            type: "Error",
            message: "Your submission must contain at least 2 sentences. Please write more."
          });
          return;
        }

        submissions.push({ id: submittingPlayer.id, text: submittedText });

        console.log(`${submittingPlayer.name} submitted text: "${submittedText}"`);

        // Notify that the player has submitted their text
        broadcast({
          type: "UserSubmitted",
          id: message.id,
          message: `${submittingPlayer.name} has submitted their text.`
        });

        // Move to the next player
        currentPlayerIndex++;
        sendYourTurn();
        break;

      case "GuessAI":
        // Client to Server: A user has made a guess
        const guessingPlayer = players.find(p => p.id === message.id);
        if (!guessingPlayer) {
          console.log("Guessing player not found:", message.id);
          return;
        }

        if (typeof message.selectedIndex !== 'number') {
          console.log("Invalid guess from player:", message.id);
          return;
        }

        const isCorrect = message.selectedIndex === aiSubmissionIndex;

        // Send result to the player
        sendToPlayer(guessingPlayer, {
          type: "GuessResult",
          message: isCorrect ? "SUCCESS" : "FAILED"
        });

        console.log(`${guessingPlayer.name} guessed ${isCorrect ? "correctly" : "incorrectly"}.`);

        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected.');

  // Listen for messages from the client
  ws.on('message', (data) => {
    console.log("Received message:", data);
    handleMessage(ws, data);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected.');
    // Remove the player from the list
    const playerIndex = players.findIndex(player => player.ws === ws);
    if (playerIndex !== -1) {
      const [removedPlayer] = players.splice(playerIndex, 1);
      console.log(`Player left: ${removedPlayer.name} (ID: ${removedPlayer.id})`);
      // Notify remaining players
      broadcast({
        type: "UserLeft",
        message: `${removedPlayer.name} has left the game.`
      });
    }
    // If the game was ongoing and a player left, you might want to handle it
    if (gameStarted && players.length === 0) {
      gameStarted = false;
      console.log("Game ended due to all players leaving.");
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send a welcome message
  ws.send(JSON.stringify({ type: "Welcome", message: "Welcome to the game! Please send your UserJoined message." }));
});