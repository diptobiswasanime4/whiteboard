import React, { useEffect, useRef } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let mode = "rectangle";
        let isDrawing = false;
        let startX, startY;
        let rectangles = [];

        document.addEventListener("click", e => {
            if (e.srcElement.id !== "canvas") {
                mode = e.srcElement.id;
            }
        });

        const drawRect = (x, y, width, height) => {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        };

        const redraw = () => {
            for (let i = 0; i < rectangles.length; i++) {
                let rectangle = rectangles[i];
                drawRect(rectangle.startX, rectangle.startY, rectangle.width, rectangle.height);
            }
        };

        const handleMouseDown = (e) => {
            isDrawing = true;
            startX = e.clientX - canvas.getBoundingClientRect().left;
            startY = e.clientY - canvas.getBoundingClientRect().top;
        };

        const handleMouseMove = (e) => {
            if (!isDrawing) return;
            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;

            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX + e.movementX, currentY + e.movementY);
            ctx.stroke();

            if (mode === "rectangle") {
                const width = currentX - startX;
                const height = currentY - startY;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                redraw();

                drawRect(startX, startY, width, height);
            }
        };

        const handleMouseUp = (e) => {
            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;

            if (mode === "rectangle") {
                const width = currentX - startX;
                const height = currentY - startY;

                rectangles.push({ startX, startY, width, height });
            }
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            // Cleanup event listeners when component unmounts
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };

    }, []); // Empty dependency array to run the effect once on mount

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={300}
            style={{ border: '2px solid black' }}
        ></canvas>
    );
};

export default Canvas;
