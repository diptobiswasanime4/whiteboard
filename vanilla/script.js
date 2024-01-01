const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let mode = "pencil"

let isDrawing = false;
let startX, startY;
let prevX, prevY
let rectangles = []

document.addEventListener("click", e => {
    if (e.srcElement.id != "canvas") {
        mode = e.srcElement.id
    }
})

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const currentX = e.clientX - canvas.getBoundingClientRect().left;
    const currentY = e.clientY - canvas.getBoundingClientRect().top;
    console.log(e);

    ctx.beginPath()
    ctx.moveTo(currentX, currentY)
    ctx.lineTo(currentX + e.movementX, currentY + e.movementY)
    ctx.stroke()

    if (mode == "rectangle") {

        const width = currentX - startX;
        const height = currentY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw()

        drawRect(startX, startY, width, height);
    }
});

canvas.addEventListener('mouseup', (e) => {
    const currentX = e.clientX - canvas.getBoundingClientRect().left;
    const currentY = e.clientY - canvas.getBoundingClientRect().top;

    if (mode == "rectangle") {
        const width = currentX - startX;
        const height = currentY - startY;

        rectangles.push({ startX, startY, width, height })
    }
    isDrawing = false;
});

function redraw() {
    for (let i = 0; i < rectangles.length; i++) {
        let rectangle = rectangles[i]
        drawRect(rectangle.startX, rectangle.startY, rectangle.width, rectangle.height)
    }
}

function drawRect(x, y, width, height) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}