export class Matrix3 {
    a: number; b: number; c: number;
    d: number; e: number; f: number;
    g: number; h: number; i: number;

    static zero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    static identity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    // TODO: static fromArray(arr: number[]): Matrix3

    // TODO: static rotateX(angle: number): Matrix3

    // TODO: static rotateY(angle: number): Matrix3

    // TODO: static rotateZ(angle: number): Matrix3

    // TODO: static scale(xScale: number, yScale?: number, zScale?: number): Matrix3

    constructor(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) {
        this.a = a; this.b = b; this.c = c;
        this.d = d; this.e = e; this.f = f;
        this.g = g; this.h = h; this.i = i;
    }

    // TODO: get array(): number[]

    // TODO: get determinate(): number

    // TODO: get clone(): Matrix3

    // TODO: add(matrix: Matrix3): Matrix3

    // TODO: sub(matrix: Matrix3): Matrix3

    // TODO: mult(matrix: Matrix3): Matrix3

    // TODO: scale(scaler: number): Matrix3

    // TODO: inverseScale(scaler: number): Matrix3

    // TODO: inverse(): Matrix3 | null

    // TODO: transpose(): Matrix3
}