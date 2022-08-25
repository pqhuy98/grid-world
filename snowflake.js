var ctx = document.getElementById("grid").getContext("2d");
ctx.canvas.width = window.innerWidth / 2;
ctx.canvas.height = window.innerHeight / 2;

var xcenter = ctx.canvas.width / 2;
var ycenter = ctx.canvas.height / 2;

function draw({ x, y, count, length, depth, angle }, currentDepth = 1) {
    let anglePerIter = 2 * Math.PI / count;

    for (let i = 0; i < count; i++) {
        let x1 = x + Math.cos(angle + i * anglePerIter) * length;
        let y1 = y + Math.sin(angle + i * anglePerIter) * length;

        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);

        if (currentDepth < depth) {
            draw({
                x: (x + x1) / 2,
                y: (y + y1) / 2,
                count: Math.random() * 6,
                length: length * 1 / 2.2,
                angle: angle + i * anglePerIter,
                depth,
            }, currentDepth + 1);
        }
    }
}

draw({
    x: xcenter,
    y: ycenter,
    count: Math.random() * 6,
    length: 300,
    depth: 4,
    angle: Math.random() * Math.PI * 2,
})
ctx.stroke();

var peer = new Peer(); 
