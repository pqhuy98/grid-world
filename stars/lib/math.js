// linear algebra export functions
export function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y }
}
export function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y }
}
export function mul(a, k) {
    return { x: a.x * k, y: a.y * k }
}
export function zero() {
    return { x: 0, y: 0 }
}
export function magnitude(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y)
}
export function normalize(a) {
    let angle = Math.atan2(a.y, a.x)
    return { x: Math.cos(angle), y: Math.sin(angle) }
}
export function clip(x, l, r) {
    return Math.max(l, Math.min(r, x))
}

// random export functions
export function randomFloat(l, r) {
    return Math.random() * (r - l) + l
}

export function randomInt(l, r) {
    return ~~(randomFloat(l, r))
}

export function randomExp(l, r) {
    return Math.exp(randomFloat(Math.log(l), Math.log(r)))
}

export function randomColor() {
    var letters = "0123456789ABCDEF"
    var color = "#"
    for (var i = 0; i < 6; i++) {
        color += letters[~~(Math.random() * 16)]
    }
    return color
}

export function pickRandom(arr) {
    return arr[randomInt(0, arr.length)]
}