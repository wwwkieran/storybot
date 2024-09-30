const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);

            // Handle different types of messages
            if (data.type === 'greeting') {
                ws.send(JSON.stringify({ type: 'response', message: 'Hello, client!' }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
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