import { Matrix3 } from "../src/matrix3";

test("Matrix.fromArray()", () => {
    const mat = Matrix3.fromArray([6, 3, 9, 1, 3, 0, -3, 42, 1]);
    expect(mat).toEqual(new Matrix3(6, 3, 9, 1, 3, 0, -3, 42, 1));
});

test("Matrix.rotateX()", () => {
    const sqrt3_4 = Math.sqrt(3 / 4);
    const mat = Matrix3.rotateX(Math.PI / 6);
    expect(mat.a).toBeCloseTo(1, 10);
    expect(mat.b).toBeCloseTo(0, 10);
    expect(mat.c).toBeCloseTo(0, 10);
    expect(mat.d).toBeCloseTo(0, 10);
    expect(mat.e).toBeCloseTo(sqrt3_4, 10);
    expect(mat.f).toBeCloseTo(-0.5, 10);
    expect(mat.g).toBeCloseTo(0, 10);
    expect(mat.h).toBeCloseTo(0.5, 10);
    expect(mat.i).toBeCloseTo(sqrt3_4, 10);
});

test("Matrix.rotateY()", () => {
    const sqrt3_4 = Math.sqrt(3 / 4);
    const mat = Matrix3.rotateY(-Math.PI / 6);
    expect(mat.a).toBeCloseTo(sqrt3_4, 10);
    expect(mat.b).toBeCloseTo(0, 10);
    expect(mat.c).toBeCloseTo(-0.5, 10);
    expect(mat.d).toBeCloseTo(0, 10);
    expect(mat.e).toBeCloseTo(1, 10);
    expect(mat.f).toBeCloseTo(0, 10);
    expect(mat.g).toBeCloseTo(0.5, 10);
    expect(mat.h).toBeCloseTo(0, 10);
    expect(mat.i).toBeCloseTo(sqrt3_4, 10);
});

test("Matrix.rotateZ()", () => {
    const mat = Matrix3.rotateZ(-Math.PI / 4);
    expect(mat.a).toBeCloseTo(Math.SQRT1_2, 10);
    expect(mat.b).toBeCloseTo(Math.SQRT1_2, 10);
    expect(mat.c).toBeCloseTo(0, 10);
    expect(mat.d).toBeCloseTo(-Math.SQRT1_2, 10);
    expect(mat.e).toBeCloseTo(Math.SQRT1_2, 10);
    expect(mat.f).toBeCloseTo(0, 10);
    expect(mat.g).toBeCloseTo(0, 10);
    expect(mat.h).toBeCloseTo(0, 10);
    expect(mat.i).toBeCloseTo(1, 10);
});

test("Matrix.scale()", () => {
    const mat1 = Matrix3.scale(5);
    expect(mat1).toEqual(new Matrix3(5, 0, 0, 0, 5, 0, 0, 0, 5));
    const mat2 = Matrix3.scale(6, -2, 1);
    expect(mat2).toEqual(new Matrix3(6, 0, 0, 0, -2, 0, 0, 0, 1));
    const mat3 = Matrix3.scale(64, 0, -4);
    expect(mat3).toEqual(new Matrix3(64, 0, 0, 0, 0, 0, 0, 0, -4));
});

test(".array", () => {
    const mat = new Matrix3(6, 3, 54, 1, -6, 0, -3, 42, 1);
    expect(mat.array).toEqual([6, 3, 54, 1, -6, 0, -3, 42, 1]);
});

test(".determinant", () => {
    const mat = new Matrix3(7, 48, 3, 0, 6, -7, 4, 73, 4);
    expect(mat.determinant).toEqual(2329);
});

test(".clone", () => {
    const mat = new Matrix3(66, 2, 0, 1, -32, -5, 2, 7, -624);
    const matClone = mat.clone;
    const matCloneClone = matClone.clone;

    expect(mat).not.toBe(matClone);
    expect(mat).not.toBe(matCloneClone);
    expect(matClone).not.toBe(matCloneClone);

    expect(mat).toEqual(matClone);
    expect(matClone).toEqual(matCloneClone);
});

test(".add()", () => {
    const mat1 = new Matrix3(0, -3, 0, 2, 6, 8, 57, 2, -5);
    const mat2 = new Matrix3(3, 45, 0, 0, 7, 0, -1, 2, 5);
    const result = mat1.add(mat2);

    expect(result).toBe(mat1);
    expect(mat1).toEqual(new Matrix3(3, 42, 0, 2, 13, 8, 56, 4, 0));
    expect(mat2).toEqual(new Matrix3(3, 45, 0, 0, 7, 0, -1, 2, 5));
});

test(".sub()", () => {
    const mat1 = new Matrix3(0, -3, 0, 2, 6, 8, 57, 2, 5);
    const mat2 = new Matrix3(3, 12, 1, 0, 7, 53, -1, 2, -5);
    const result = mat1.sub(mat2);

    expect(result).toBe(mat1);
    expect(mat1).toEqual(new Matrix3(-3, -15, -1, 2, -1, -45, 58, 0, 10));
    expect(mat2).toEqual(new Matrix3(3, 12, 1, 0, 7, 53, -1, 2, -5));
});

test(".mult()", () => {
    const mat1 = new Matrix3(63, 3, -4, 3, 1, 0, 0, 2, 1);
    const mat2 = new Matrix3(25, 0, -53, 0, -3, 9, 7, -8, 42);
    const result = mat1.mult(mat2);

    expect(result).toBe(mat1);
    expect(mat1).toEqual(new Matrix3(1547, 23, -3480, 75, -3, -150, 7, -14, 60));
    expect(mat2).toEqual(new Matrix3(25, 0, -53, 0, -3, 9, 7, -8, 42));
});

test(".scale()", () => {
    const mat1 = new Matrix3(0, -3, 0, 2, 6, 8, 3, 2, 5);
    const result1 = mat1.scale(1);
    expect(result1).toBe(mat1);
    expect(mat1).toEqual(new Matrix3(0, -3, 0, 2, 6, 8, 3, 2, 5));

    const mat2 = new Matrix3(0, -3, 0, 2, 6, 8, 3, -10, 5);
    const result2 = mat2.scale(3);
    expect(result2).toBe(mat2);
    expect(mat2).toEqual(new Matrix3(0, -9, 0, 6, 18, 24, 9, -30, 15));
});

test(".inverseScale()", () => {
    const mat = new Matrix3(0, -3, 0, 2.5, 6, 8, 3, -21, 5);
    const result = mat.inverseScale(3);
    expect(result).toBe(mat);
    expect(mat.a).toBeCloseTo(0, 10);
    expect(mat.b).toBeCloseTo(-1, 10);
    expect(mat.c).toBeCloseTo(0, 10);
    expect(mat.d).toBeCloseTo(2.5 / 3, 10);
    expect(mat.e).toBeCloseTo(2, 10);
    expect(mat.f).toBeCloseTo(8 / 3, 10);
    expect(mat.g).toBeCloseTo(1, 10);
    expect(mat.h).toBeCloseTo(-7, 10);
    expect(mat.i).toBeCloseTo(5 / 3, 10);
});

test(".inverse()", () => {
    const mat1 = new Matrix3(6, 3, 71, 0, -3, 5, 63, 3, 2);
    const result1 = mat1.inverse();
    expect(result1).toBe(mat1);
    expect(mat1.a).toBeCloseTo(-1 / 678, 10);
    expect(mat1.b).toBeCloseTo(23 / 1582, 10);
    expect(mat1.c).toBeCloseTo(38 / 2373, 10);
    expect(mat1.d).toBeCloseTo(5 / 226, 10);
    expect(mat1.e).toBeCloseTo(-1487 / 4746, 10);
    expect(mat1.f).toBeCloseTo(-5 / 2373, 10);
    expect(mat1.g).toBeCloseTo(3 / 226, 10);
    expect(mat1.h).toBeCloseTo(19 / 1582, 10);
    expect(mat1.i).toBeCloseTo(-1 / 791, 10);

    const mat2 = new Matrix3(2, 4, 6, 5, 10, 15, 73, 35, 23);
    const result2 = mat2.inverse();
    expect(result2).toEqual(null);
    expect(mat2).toEqual(new Matrix3(2, 4, 6, 5, 10, 15, 73, 35, 23));
});

test(".transpose()", () => {
    const mat = new Matrix3(43, 2, 0, 1, -32, -5, 2, 7, -26);
    const result = mat.transpose();
    expect(result).toBe(mat);
    expect(mat).toEqual(new Matrix3(43, 1, 2, 2, -32, 7, 0, -5, -26));
});