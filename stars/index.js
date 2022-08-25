import { everyFrame } from "./lib/renderer.js";
import Space from "./lib/space.js";

function gebi(id) { return document.getElementById(id) }

let canvas = gebi("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.border = "1px solid";

let space = new Space({
    canvas,
    starCount: 100,
})

const FPS = 60;

let currentTime = performance.now();
everyFrame(() => {
    let now = performance.now();
    let dt = (now - currentTime) / 1000;
    // if (dt < 1 / FPS) return;

    space.loop(dt);
    space.render(dt);
    currentTime = now;
})