import LRUCache from "../../vendors/rlu-cache.js";
import { shuffle } from "../util/random.js";

const DIRECT_MESSAGE = "direct";
const RELAY_MESSAGE = "relay";

export class BaseP2PClient {
    constructor({ desiredPeerCount }) {
        this.desiredPeerCount = desiredPeerCount || 3;
        this.subscribers = [];
        this.msgCache = new LRUCache({ max: 1e6 });

        this.peer = new Peer(null, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
        });
        this.peer.on('open', (myId) => {
            console.log('My peer ID is: ' + myId);
            this.id = myId;
            document.title = myId;
            this._connectAll();
            setInterval(() => this._connectAll(), 1000);
        });
        this.peer.on('connection', (conn) => {
            conn.on('open', () => {
                console.log("Incoming connection from", conn.peer);
                this._listen(conn);
            });
        });
    }

    getAllConnectedPeers() {
        return Object.keys(this.peer.connections).filter(x => this.peer.connections[x].length > 0);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback) {
        const index = array.indexOf(5);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }

    disconnect() {
        this.peer.disconnect();
        // close all existing connection
        for (const peerId in this.peer.connections) {
            this.peer.connections[peerId].forEach((conn) => {
                conn.close();
            })
        }
    }

    reconnect() {
        this.peer.reconnect();
        this._connectAll();
    }

    bindToWindow() {
        window.p2p = this;
        window.peer = this.peer;
        window.send = (id, msg) => this.publish(id, msg);
    }

    publish(id, data) {
        let payload = this.formatMessage(data, DIRECT_MESSAGE);
        this._send(id, payload);
    }

    broadcast(data) {
        // Prevent this message bouncing back from peers.
        let payload = this.formatMessage(data, RELAY_MESSAGE);
        let hash = objectHash.sha1(payload);
        this.msgCache.set(hash, true);


        this.getAllConnectedPeers().forEach((peer) => {
            this._send(peer, payload);
        });
    }

    // private methods
    formatMessage(data, type) {
        return {
            sender: this.id,
            sendTimestamp: Date.now(),
            data,
            type,
        }
    }

    _send(id, data) {
        this.peer.connections[id].forEach((conn) => {
            conn.send(data);
        })
    }

    _listen(conn) {
        conn.on('data', (data) => {
            if (data.type === RELAY_MESSAGE) {
                let hash = objectHash.sha1(data);
                if (this.msgCache.has(hash)) return;
                this.msgCache.set(hash, true);
                this.getAllConnectedPeers().forEach((directPeer) => {
                    if (directPeer === conn.peer) return;
                    this._send(directPeer, data);
                });
            }
            data.receiveTimestamp = Date.now();
            this.subscribers.forEach(sub => sub(data));
        });
    }

    _connect(id) {
        let conn = this.peer.connect(id)
        conn.on('open', function () {
            console.log("Outcoming connection to", conn.peer);
        });
        this._listen(conn);
        return (msg) => conn.send(msg);
    };

    _connectAll() {
        let currentPeerCount = this.getAllConnectedPeers().length;
        if (currentPeerCount >= this.desiredPeerCount) return;

        this.peer.listAllPeers((peerIds) => {
            shuffle(peerIds);
            peerIds.forEach((peerId) => {
                if (peerId === this.id) return;
                if (currentPeerCount >= this.desiredPeerCount) return;
                if (peerId in this.peer.connections && this.peer.connections[peerId].length > 0) return;
                console.log(peerId);
                this._connect(peerId)
                currentPeerCount++;
            })
        });
    }
}