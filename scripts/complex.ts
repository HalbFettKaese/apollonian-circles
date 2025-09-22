export class Complex {
    x: number;
    y: number;
    r: number;
    t: number;
    constructor(...args: [x: number] | [x: number, y: number] | [r: number, t: number, polar: true]) {
        if (args.length == 3) {
            this.r = args[0];
            this.t = args[1];

            this.x = this.r * Math.cos(this.t);
            this.y = this.r * Math.sin(this.t);
        } else {
            this.x = args[0];
            this.y = args.length == 1 ? 0 : args[1];
            this.r = Math.sqrt(this.x*this.x+this.y*this.y);
            this.t = Math.atan2(this.y, this.x);
        }
    }
    mul(other: Complex | number): Complex {
        if (typeof other === "number") {
            return new Complex(this.x*other, this.y*other);
        }

        return new Complex(
            this.x*other.x - this.y*other.y,
            this.y*other.x + this.x*other.y
        );
    }
    div(other: Complex | number): Complex {
        if (typeof other === "number") {
            return new Complex(this.x/other, this.y/other);
        }
        
        var inv = (other.x*other.x + other.y*other.y);
        return new Complex(
            (this.x*other.x + this.y*other.y) / inv,
            (this.y*other.x - this.x*other.y) / inv
        );
    }
    add(other: Complex | number): Complex {
        if (typeof other === "number") {
            return new Complex(this.x + other, this.y);
        }
        
        return new Complex(
            this.x + other.x,
            this.y + other.y
        );
    }
    sub(other: Complex | number): Complex {
        if (typeof other === "number") {
            return new Complex(this.x - other, this.y);
        }
        
        return new Complex(
            this.x - other.x,
            this.y - other.y
        );
    }
    pow(other: Complex | number): Complex {
        if (typeof other === "number") {
            return new Complex(Math.pow(this.r, other), this.t * other, true);
        }
        
        var lnr = Math.log(this.r);
        return new Complex(Math.exp(lnr*other.x - this.t*other.y), lnr*other.y + this.t*other.x);
    }
    get length(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
}

export type Circle = [center: Complex, radius: number];