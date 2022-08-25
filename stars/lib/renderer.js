export function everyFrame(callback) {
    let refreshLoop = () => {
        window.requestAnimationFrame(refreshLoop);
        callback();
    }
    refreshLoop();
}