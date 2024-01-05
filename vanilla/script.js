const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const lineWidthElem = document.getElementById("lineWidth")
const colorElem = document.getElementById("color")

let modes = ["pencil", "rectangle", "circle", "line", "text", "erase"]
let mode = "pencil"

let isDrawing = false;
let startX, startY;
let prevX, prevY
let curX, curY
let drawings = []
let pencil_strokes = []

document.addEventListener("click", e => {
    if (modes.includes(e.srcElement.id)) {
        mode = e.srcElement.id
        console.log(mode);
    }
})

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
    curX = startX
    curY = startY
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    prevX = curX
    prevY = curY
    curX = e.clientX - canvas.getBoundingClientRect().left;
    curY = e.clientY - canvas.getBoundingClientRect().top;



    switch (mode) {
        case "pencil":
            pencil_strokes.push({ prevX, prevY, curX, curY, lineWidth: lineWidthElem.value, color: colorElem.value })
            pencilDraw({ prevX, prevY, curX, curY, lineWidth: lineWidthElem.value, color: colorElem.value })
            break;
        case "erase":
            pencil_strokes.push({ prevX, prevY, curX, curY, lineWidth: lineWidthElem.value, color: 'white' })
            pencilDraw({ prevX, prevY, curX, curY, lineWidth: lineWidthElem.value, color: 'white' })
            break;
        case "rectangle":
            const width = curX - startX;
            const height = curY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rectDraw({ x: startX, y: startY, width, height, lineWidth: lineWidthElem.value, color: colorElem.value });
            break;
        case "circle":
            const dirX = curX - startX
            const dirY = curY - startY
            const radius = Math.sqrt(dirX * dirX + dirY * dirY)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circleDraw({ x: startX, y: startY, radius, lineWidth: lineWidthElem.value, color: colorElem.value })
            break;
        case "line":
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lineDraw({ x1: startX, y1: startY, x2: curX, y2: curY, lineWidth: lineWidthElem.value, color: colorElem.value })
            break;
        default:
    }
    redraw()
});

canvas.addEventListener('mouseup', (e) => {
    switch (mode) {
        case "pencil":
            drawings.push({ type: "pencil", strokes: pencil_strokes })
            pencil_strokes = []
            break;
        case "erase":
            drawings.push({ type: "erase", strokes: pencil_strokes })
            pencil_strokes = []
            break;
        case "rectangle":
            const width = curX - startX;
            const height = curY - startY;
            drawings.push({ type: "rectangle", args: { x: startX, y: startY, width, height, lineWidth: lineWidthElem.value, color: colorElem.value } })
            break;
        case "circle":
            const dirX = curX - startX
            const dirY = curY - startY
            const radius = Math.sqrt(dirX * dirX + dirY * dirY)
            drawings.push({ type: "circle", args: { x: startX, y: startY, radius, lineWidth: lineWidthElem.value, color: colorElem.value } })
            break;
        case "line":
            drawings.push({ type: "line", args: { x1: startX, y1: startY, x2: curX, y2: curY, lineWidth: lineWidthElem.value, color: colorElem.value } })

        default:
            break;
    }
    isDrawing = false;
});

function redraw() {
    console.log(drawings);
    for (let i = 0; i < drawings.length; i++) {
        let drawing = drawings[i]
        switch (drawing.type) {
            case "pencil":
                for (let i = drawing.strokes.length - 1; i >= 0; i++) {
                    pencilDraw(drawing.strokes[i])
                }
                break;
            case "erase":
                for (let i = drawing.strokes.length - 1; i >= 0; i++) {
                    pencilDraw(drawing.strokes[i])
                }
                break;
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

function rectDraw({ x, y, width, height, lineWidth, color }) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.strokeRect(x, y, width, height);
}

// Bug: Circle is drawn in the opposite dir
// Bug: Color is changing for last circle while drawing a new Circle
function circleDraw({ x, y, radius, lineWidth, color }) {
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.arc(x, y, radius, 0, Math.PI * 2, false)
    ctx.stroke()
}

function lineDraw({ x1, y1, x2, y2, lineWidth, color }) {
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function pencilDraw({ prevX, prevY, curX, curY, lineWidth, color }) {
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(curX, curY)
    ctx.stroke()
}