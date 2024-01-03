const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let modes = []
let mode = "pencil"

let isDrawing = false;
let startX, startY;
let prevX, prevY
let drawings = []
let rectangles = []

document.addEventListener("click", e => {
    if (e.srcElement.id != "canvas") {
        mode = e.srcElement.id
        console.log(mode);
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

    ctx.beginPath()
    ctx.moveTo(currentX, currentY)
    ctx.lineTo(currentX + e.movementX, currentY + e.movementY)
    ctx.stroke()

    if (mode == "rectangle") {

        const width = currentX - startX;
        const height = currentY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw()

        rectDraw({ x: startX, y: startY, width, height });
    } else if (mode == "circle") {
        const dirX = currentX - startX
        const dirY = currentY - startY
        const radius = Math.sqrt(dirX * dirX + dirY * dirY)

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw()

        circleDraw({ x: startX, y: startY, radius })
    } else if (mode == "line") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw()
        lineDraw({ x1: startX, y1: startY, x2: currentX, y2: currentY })
    }
});

canvas.addEventListener('mouseup', (e) => {
    const currentX = e.clientX - canvas.getBoundingClientRect().left;
    const currentY = e.clientY - canvas.getBoundingClientRect().top;

    switch (mode) {
        case "rectangle":
            const width = currentX - startX;
            const height = currentY - startY;
            drawings.push({ type: "rectangle", args: { x: startX, y: startY, width, height } })
            break;
        case "circle":
            const dirX = currentX - startX
            const dirY = currentY - startY
            const radius = Math.sqrt(dirX * dirX + dirY * dirY)
            drawings.push({ type: "circle", args: { x: startX, y: startY, radius } })
            break;
        case "line":
            drawings.push({ type: "line", args: { x1: startX, y1: startY, x2: currentX, y2: currentY } })

        default:
            break;
    }
    isDrawing = false;
});

function redraw() {
    for (let i = 0; i < drawings.length; i++) {
        let drawing = drawings[i]
        console.log(drawing);
        switch (drawing.type) {
            case "rectangle":
                rectDraw(drawing.args)
                break;
            case "circle":
                circleDraw(drawing.args)
                break;
            case "line":
                lineDraw(drawing.args)
        }
    }
}

function rectDraw({ x, y, width, height }) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

// Bug: Circle is drawn in the opposite dir
function circleDraw({ x, y, radius }) {
    ctx.beginPath()
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.arc(x, y, radius, 0, Math.PI * 2, false)
    ctx.stroke()
}

function lineDraw({ x1, y1, x2, y2 }) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}