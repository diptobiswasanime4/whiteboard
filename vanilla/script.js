const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let startX, startY;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentX = e.clientX - canvas.getBoundingClientRect().left;
    const currentY = e.clientY - canvas.getBoundingClientRect().top;

    const width = currentX - startX;
    const height = currentY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(startX, startY, width, height);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

function drawRect(x, y, width, height) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}