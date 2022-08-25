const { PeerServer } = require('peer');

const peerServer = PeerServer({
    port: 9000,
    path: '/myapp',
    allow_discovery: true
});