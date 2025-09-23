import { Complex, Circle } from "./complex.js";
import { SortedList } from "./sortedlist.js";


export function *findTangentCircles([z1, r1]: Circle, [z2, r2]: Circle, [z3, r3]: Circle): Generator<Circle> {
    var k1 = 1/r1;
    var k2 = 1/r2;
    var k3 = 1/r3;

    for (var i = 0; i < 2; i++) {
        var s1 = (i == 1) ? 1 : -1;
        var s2 = -s1;
        
        var k4 = k1+k2+k3 + s1 * 2 * Math.sqrt(Math.max(0, k1*k2+k1*k3+k2*k3));
        var r4 = 1/k4;

        var z1k1 = z1.mul(k1);
        var z2k2 = z2.mul(k2);
        var z3k3 = z3.mul(k3);

        if (Math.abs(k1+k2+k3-k4) < 0.01) {
            // Get 2 center solutions from 1 curvature
            var z4 = z1k1.add(z2k2).add(z3k3).add(z1k1.mul(z2k2).add(z1k1.mul(z3k3)).add(z2k2.mul(z3k3)).pow(0.5).mul(2*s1)).div(k4);
            yield [z4, r4];
            continue;
        }
        // Get 1 center solution per curvature
        
        var ksum = 0.5*(k1 + k2 + k3 + k4);
        var z4 = z1k1.mul(ksum-k1).add(z2k2.mul(ksum-k2)).add(z3k3.mul(ksum-k3)).div(-k4*(ksum-k4));

        yield [z4, r4];
    }
}

export function findTangentCircle([z1, r1]: Circle, [z2, r2]: Circle, [z3, r3]: Circle, [z4, r4]: Circle): Circle {
    var k1 = 1/r1;
    var k2 = 1/r2;
    var k3 = 1/r3;
    var k4 = 1/r4;
    // k1 + k1' = 2(k2+k3+k4)
    var knew = 2*(k2+k3+k4) - k1;
    var z1k1 = z1.mul(k1);
    var z2k2 = z2.mul(k2);
    var z3k3 = z3.mul(k3);
    var z4k4 = z4.mul(k4);
    var znew = z2k2.add(z3k3).add(z4k4).mul(2).sub(z1k1).div(knew);
    return [znew, 1/knew];
}

export function drawApollonian(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, init_circles: [Circle, Circle, Circle]) {
    
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var minDim = Math.min(canvas.width, canvas.height) - 10;
    
    function draw_circle([z, r_old]: Circle): number {
        r_old = Math.abs(r_old);
        var [x, y, r] = [(z.x * minDim + canvas.width)/2, (-z.y * minDim + canvas.height)/2, r_old * minDim/2];
        if (r_old < 20) {
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 2*Math.PI);
            ctx.stroke();
        }

        var dx = Math.abs(Math.max(0, Math.min(canvas.width, x)) - x);
        var dy = Math.abs(Math.max(0, Math.min(canvas.height, y)) - y);
        if (dx > 10*r || dy > 10*r) return -1;
        if (r < 1) return 0;
        return 1;
    }

    var circle_queue = new SortedList<Circle[]>( ([[z1,r1]], [[z2,r2]]) => Math.abs(r2)-Math.abs(r1));

    function add_circle(c: Circle, parents: [Circle, Circle, Circle], i: number) {
        var success = draw_circle(c);
        if (success == 1 || (success == 0 && i < 500)) {
            circle_queue.insert([c, ...parents]);
        }
    }

    init_circles.forEach(draw_circle);
    for (var child of findTangentCircles(...init_circles)) {
        add_circle(child, init_circles, 0);
    }

    for (var i = 0; i < 1000 && circle_queue.length > 0; i++) {
        var [c4, c1, c2, c3] = circle_queue.pop();
        add_circle(findTangentCircle(c3, c1, c2, c4), [c1, c2, c4], i);
        add_circle(findTangentCircle(c2, c1, c3, c4), [c1, c3, c4], i);
        add_circle(findTangentCircle(c1, c3, c2, c4), [c3, c2, c4], i);
    }
}