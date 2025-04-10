// proxy.js
const WebSocket = require('ws');

// Configuration du serveur WebSocket local
const wsServer = new WebSocket.Server({
    port: 3007,
    // Ajouter ces options
    handleProtocols: () => 'websocket',
    perMessageDeflate: false,
    clientTracking: true
});

// URL de l'API WebSocket distante
const remoteEndpoint = 'ws://localhost:3006';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3JlZW5tb25pdG9yIiwicm9sZSI6ImVudmlyb25tZW50YWxfbW9uaXRvciIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDEwMDAwfQ.YOUR_SIGNATURE_HERE';

class WebSocketHandler {
    constructor(clientWs, req) {
        this.clientWs = clientWs;
        this.req = req;
        this.initializeConnection();
    }

    initializeConnection() {
        try {
            this.remoteWs = new WebSocket(remoteEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Upgrade': 'websocket',
                    'Connection': 'Upgrade'
                },
                rejectUnauthorized: false,
                perMessageDeflate: false,
                followRedirects: true
            });

            this.setupEventHandlers();
        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.clientWs.close();
        }
    }

    setupEventHandlers() {
        this.remoteWs.on('open', () => {
            console.log('Connexion établie avec le serveur distant');
            this.remoteWs.send(JSON.stringify({ type: 'init', message: 'Connection initialized' }));
        });

        this.clientWs.on('message', (message) => {
            if (this.remoteWs.readyState === WebSocket.OPEN) {
                console.log('Message client:', message.toString());
                this.remoteWs.send(message);
            }
        });

        this.remoteWs.on('message', (message) => {
            if (this.clientWs.readyState === WebSocket.OPEN) {
                console.log('Message serveur:', message.toString());
                this.clientWs.send(message);
            }
        });

        this.setupCloseHandlers();
    }

    setupCloseHandlers() {
        this.clientWs.on('close', () => {
            console.log('Client déconnecté');
            if (this.remoteWs.readyState === WebSocket.OPEN) {
                this.remoteWs.close();
            }
        });

        this.remoteWs.on('close', () => {
            console.log('Serveur distant déconnecté');
            if (this.clientWs.readyState === WebSocket.OPEN) {
                this.clientWs.close();
            }
        });
    }
}

wsServer.on('connection', (ws, req) => {
    console.log('Nouvelle connexion client');
    new WebSocketHandler(ws, req);
});

// Gestion des erreurs du serveur
wsServer.on('error', (error) => {
    console.error('Erreur serveur:', error);
});

console.log('Serveur proxy démarré sur ws://localhost:3007');
