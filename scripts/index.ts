import { Complex, Circle } from "./complex.js";
import { drawApollonian } from "./apollonian.js";

function main() {

    var canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width.toString();
    canvas.style.height = canvas.height.toString();
    var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    var r = 0.25;
    var init_circles: [Circle, Circle, Circle] = [
        [new Complex(0, 1-r), r],
        [new Complex(0, -r), 1-r],
        [new Complex(0, 0), -1]
    ]
    drawApollonian(canvas, ctx, init_circles);
        
    var minDim = Math.min(canvas.width, canvas.height) - 10;

    var holdingMouse = false;

    function drawWithMouse(x: number, y: number) {
        var x =  (x * 2 - canvas.width) / minDim;
        var y = -(y * 2 - canvas.height) / minDim;
        var r = 1 - Math.sqrt(x*x+y*y);

        var R = (r*r-x*x-(1-y)*(1-y))/(2*(y-r-1));
        init_circles[0] = [new Complex(x, y), r];
        init_circles[1] = [new Complex(0, 1-R), R];
        drawApollonian(canvas, ctx, init_circles);
    }

    canvas.addEventListener("click", ev => {
        holdingMouse = !holdingMouse;
        if (holdingMouse)
            drawWithMouse(ev.offsetX, ev.offsetY);
    });
    canvas.addEventListener("mousemove", ev => {
        if (holdingMouse)
            drawWithMouse(ev.offsetX, ev.offsetY);
    });
}

window.onload = main;