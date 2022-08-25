import LRUCache from "../../vendors/rlu-cache.js";
import { BaseP2PClient } from "./base.js";

export class Broadcaster extends BaseP2PClient {
    constructor(options) {
        super(options);
        this.msgCache = new LRUCache({ max: 10e6 })

        this.subscribe((msg) => {

        })
    }

    broadcast()
}