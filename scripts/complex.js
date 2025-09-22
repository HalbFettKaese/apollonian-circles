export class Complex {
    constructor(...args) {
        if (args.length == 3) {
            this.r = args[0];
            this.t = args[1];
            this.x = this.r * Math.cos(this.t);
            this.y = this.r * Math.sin(this.t);
        }
        else {
            this.x = args[0];
            this.y = args.length == 1 ? 0 : args[1];
            this.r = Math.sqrt(this.x * this.x + this.y * this.y);
            this.t = Math.atan2(this.y, this.x);
        }
    }
    mul(other) {
        if (typeof other === "number") {
            return new Complex(this.x * other, this.y * other);
        }
        return new Complex(this.x * other.x - this.y * other.y, this.y * other.x + this.x * other.y);
    }
    div(other) {
        if (typeof other === "number") {
            return new Complex(this.x / other, this.y / other);
        }
        var inv = (other.x * other.x + other.y * other.y);
        return new Complex((this.x * other.x + this.y * other.y) / inv, (this.y * other.x - this.x * other.y) / inv);
    }
    add(other) {
        if (typeof other === "number") {
            return new Complex(this.x + other, this.y);
        }
        return new Complex(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        if (typeof other === "number") {
            return new Complex(this.x - other, this.y);
        }
        return new Complex(this.x - other.x, this.y - other.y);
    }
    pow(other) {
        if (typeof other === "number") {
            return new Complex(Math.pow(this.r, other), this.t * other, true);
        }
        var lnr = Math.log(this.r);
        return new Complex(Math.exp(lnr * other.x - this.t * other.y), lnr * other.y + this.t * other.x);
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
