import { add, mul } from "./math.js";

export default class Star {
    constructor({ pos, velo, size }) {
        Object.assign(this, {
            pos,
            velo,
            size,
            deleted: false,
        });
    }

    loop(dt) {
        this.pos = add(this.pos, mul(this.velo, dt));
    }
}