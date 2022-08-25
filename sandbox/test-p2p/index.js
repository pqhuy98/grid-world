import { P2PClient } from "../../lib/p2p/index.js";
import { sleep } from "../../lib/util/helpers.js";

document.getElementById("input").style.backgroundColor = "green";

const metadata = {
    isBot: window.innerHeight < 100,
}
document.getElementById("metadata").innerHTML = JSON.stringify(metadata);

var p2p = new P2PClient({
    desiredPeerCount: 3,
});
p2p.bindToWindow();

p2p.subscribe((msg) => {
    console.log("Receive:", msg);
    document.getElementById("latency").innerText = (msg.receiveTimestamp - msg.sendTimestamp);
})

setInterval(() => {
    let ans = {};
    for (const peer of p2p.getAllConnectedPeers()) {
        ans[peer] = p2p.peer.connections[peer].length;
    }

    let text = JSON.stringify(ans, 0, 2);
    document.getElementById("text").innerHTML = text;
}, 500)

// Broadcast
document.getElementById("broadcast").onclick = () => {
    let data = document.getElementById("input").value;
    p2p.broadcast(data);
}

// Broadcast big
let data = "";
for (let i = 0; i < 1e5; i++) {
    data += "x";
}
document.getElementById("broadcast-big").onclick = () => {
    p2p.broadcast(data);
}

// Connect/disconnect
function updateButton() {
    document.getElementById("connect").disabled = !p2p.peer.disconnected;
    document.getElementById("disconnect").disabled = p2p.peer.disconnected;
}

document.getElementById("connect").onclick = () => {
    p2p.peer.reconnect();
    updateButton()
}

document.getElementById("disconnect").onclick = () => {
    p2p.disconnect();
    updateButton()
}

updateButton();

// new client
document.getElementById("new-client").onclick = async () => {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
            await sleep(500);
            window.open('http://127.0.0.1:5500/', '' + Math.random(), `height=50,width=25,top=${500 + i * 150},left=${j * 150}`)
        }
    }
}

// refresh all
document.getElementById("refresh-all").onclick = () => {
    p2p.broadcast("please refresh!!!");
    setTimeout(() => window.location.reload(), 1000);
}
p2p.subscribe((msg) => {
    if (msg.data === "please refresh!!!") {
        console.log("I refresh");
        setTimeout(() => window.location.reload(), 1000);
    }
})

// change color
document.getElementById("change-color").onclick = () => {
    var randomColor = "#" + (Math.floor(Math.random() * 16777215).toString(16));
    document.getElementById("input").style.backgroundColor = randomColor;
    p2p.broadcast({ cmd: "color", color: randomColor });
}
p2p.subscribe((msg) => {
    if (msg.data.cmd === "color") {
        document.getElementById("input").style.backgroundColor = msg.data.color;
    }
})

// kill client
// change color
document.getElementById("kill-client").onclick = () => {
    p2p.broadcast({ cmd: "kill-client" });
}
p2p.subscribe((msg) => {
    if (msg.data.cmd === "kill-client" && metadata.isBot) {
        setTimeout(() => p2p.disconnect(), 500);
        setTimeout(() => window.close(), 1000);
    }
})