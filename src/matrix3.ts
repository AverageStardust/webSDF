class Matrix3 {
    elm11: number;
    elm12: number;
    elm13: number;
    elm21: number;
    elm22: number;
    elm23: number;
    elm31: number;
    elm32: number;
    elm33: number;

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

    constructor(elm11: number, elm12: number, elm13: number, elm21: number, elm22: number, elm23: number, elm31: number, elm32: number, elm33: number) {
        this.elm11 = elm11;
        this.elm12 = elm12;
        this.elm13 = elm13;
        this.elm21 = elm21;
        this.elm22 = elm22;
        this.elm23 = elm23;
        this.elm31 = elm31;
        this.elm32 = elm32;
        this.elm33 = elm33;
    }

    // TODO: get array(): number[]

    // TODO: get determinate(): number

    // TODO: get inverse(): Matrix3 | null

    // TODO: get transpose(): Matrix3

    // TODO: get clone(): Matrix3

    // TODO: add(matrix: Matrix3): Matrix3

    // TODO: sub(matrix: Matrix3): Matrix3

    // TODO: mult(matrix: Matrix3): Matrix3

    // TODO: scale(scaler: number): Matrix3

    // TODO: inverseScale(scaler: number): Matrix3
}