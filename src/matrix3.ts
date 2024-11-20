import { Vector3 } from "./vector3";

class Matrix3 {
    row1: Vector3;
    row2: Vector3;
    row3: Vector3;

    static zero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    static identity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    // TODO: static fromArray(arr: number[]): Matrix3

    // TODO: static fromRows(row1: Vector3, row2: Vector3, row3: Vector3): Matrix3

    // TODO: static rotateX(angle: number): Matrix3

    // TODO: static rotateY(angle: number): Matrix3

    // TODO: static rotateZ(angle: number): Matrix3

    // TODO: static scale(xScale: number, yScale?: number, zScale?: number): Matrix3

    constructor(elm11: number, elm12: number, elm13: number, elm21: number, elm22: number, elm23: number, elm31: number, elm32: number, elm33: number) {
        this.row1 = new Vector3(elm11, elm12, elm13);
        this.row2 = new Vector3(elm21, elm22, elm23);
        this.row3 = new Vector3(elm31, elm32, elm33);
    }

    // TODO: get array(): number[]

    // TODO: get rows(): [Vector3, Vector3, Vector3]

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