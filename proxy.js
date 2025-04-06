// proxy.js
const WebSocket = require('ws');

// Configuration du serveur WebSocket local
const wss = new WebSocket.Server({
    port: 3007,
    // Ajouter ces options
    handleProtocols: () => 'websocket',
    perMessageDeflate: false,
    clientTracking: true
});

// URL de l'API WebSocket distante
const remoteWebSocketUrl = 'ws://localhost:3006';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6InBheWV0Iiwicm9sZSI6Ik5ld3RvbkNpZWw5MkFJQDIwMjUhIiwiaWF0IjoxNzM4NjU0NTE4LCJleHAiOjE3Mzg2NTgxMTh9.95Yed7YjKzW8uXnncY3fo4Tk13-U23muORzdQXFtaNA';

wss.on('connection', (ws, req) => {
    console.log('Client connecté au proxy WebSocket');
    console.log('Headers de la requête:', req.headers);

    try {
        const remoteSocket = new WebSocket(remoteWebSocketUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Upgrade': 'websocket',
                'Connection': 'Upgrade'
            },
            rejectUnauthorized: false,
            perMessageDeflate: false,
            followRedirects: true
        });

        remoteSocket.on('upgrade', () => {
            console.log('Connexion en cours de mise à niveau');
        });

        remoteSocket.on('open', () => {
            console.log('Connexion établie avec le serveur distant');
            // Envoyer un message de test
            remoteSocket.send(JSON.stringify({ type: 'test', message: 'Connection test' }));
        });

        remoteSocket.on('error', (error) => {
            console.error('Erreur de connexion:', error.message);
        });

        ws.on('message', (message) => {
            if (remoteSocket.readyState === WebSocket.OPEN) {
                console.log('Message reçu du client local:', message.toString());
                remoteSocket.send(message);
            }
        });

        remoteSocket.on('message', (message) => {
            if (ws.readyState === WebSocket.OPEN) {
                console.log('Message reçu du serveur distant:', message.toString());
                ws.send(message);
            }
        });

        ws.on('close', () => {
            console.log('Connexion WebSocket avec le client local fermée');
            if (remoteSocket.readyState === WebSocket.OPEN) {
                remoteSocket.close();
            }
        });

        remoteSocket.on('close', () => {
            console.log('Connexion WebSocket avec le serveur distant fermée');
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        });

    } catch (error) {
        console.error('Erreur lors de la création de la connexion distante:', error);
        ws.close();
    }
});

// Gestion des erreurs du serveur
wss.on('error', (error) => {
    console.error('Erreur du serveur WebSocket:', error);
});

console.log('Serveur proxy WebSocket en écoute sur ws://localhost:3007');
