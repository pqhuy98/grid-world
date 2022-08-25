import { mul, randomFloat, zero } from "./math.js";
import Star from "./star.js";

export default class Space {
    constructor({ canvas, starCount }) {
        Object.assign(this, { canvas, starCount });
        this.ctx = canvas.getContext("2d");
        this.stars = [];
        for (var i = 0; i < starCount; i++) {
            this.stars.push(new Star({
                pos: {
                    x: randomFloat(0, canvas.width),
                    y: randomFloat(0, canvas.height),
                },
                velo: {
                    x: randomFloat(0, 100),
                    y: randomFloat(0, 100),
                },
                size: randomFloat(10, 20),
            }))
        }
    }

    loop(dt) {
        this.stars.forEach(star => star.loop(dt));
        this.stars = this.stars.filter(star => !star.deleted);
    }

    render(dt) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "white";

        this.ctx.beginPath();
        this.stars.forEach(star => {
            this.ctx.moveTo(star.pos.x + star.size, star.pos.y);
            this.ctx.arc(star.pos.x, star.pos.y, star.size, 0, 2 * Math.PI);
        });
        this.ctx.fill();
    }
}