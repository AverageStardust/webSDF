import { Matrix3 } from "../src/matrix3";
import { Vector3 } from "../src/vector3";

test("Vector3.fromArray()", () => {
    expect(Vector3.fromArray([3, 0, 2]))
        .toEqual(new Vector3(3, 0, 2));
    expect(Vector3.fromArray([234, 2, 2]))
        .toEqual(new Vector3(234, 2, 2));
    expect(Vector3.fromArray([2, -4, -6]))
        .toEqual(new Vector3(2, -4, -6));
});

test("Vector3.fromObject()", () => {
    expect(Vector3.fromObject({ x: 5, y: 0, z: 2 }))
        .toEqual(new Vector3(5, 0, 2));
    expect(Vector3.fromObject({ x: 23, y: 24, z: -6 }))
        .toEqual(new Vector3(23, 24, -6));
    expect(Vector3.fromObject({ x: 21, y: -4, z: -6 }))
        .toEqual(new Vector3(21, -4, -6));
});

// static fromAngles(theta: number, phi: number, length: number): Vector3

test(".length", () => {
    expect(new Vector3(3, 0, 0).length)
        .toBeCloseTo(3, 10);
    expect(new Vector3(0, -2, 0).length)
        .toBeCloseTo(2, 10);
    expect(new Vector3(1, 0, 1).length)
        .toBeCloseTo(Math.SQRT2, 10);
    expect(new Vector3(0, -1, -2).length)
        .toBeCloseTo(Math.sqrt(5), 10);
    expect(new Vector3(7, 2, -4).length)
        .toBeCloseTo(Math.sqrt(69), 10);
});

test(".lengthSq", () => {
    expect(new Vector3(3, 0, 0).lengthSq)
        .toBeCloseTo(9, 10);
    expect(new Vector3(0, -2, 0).lengthSq)
        .toBeCloseTo(4, 10);
    expect(new Vector3(1, 0, 1).lengthSq)
        .toBeCloseTo(2, 10);
    expect(new Vector3(0, -1, -2).lengthSq)
        .toBeCloseTo(5, 10);
    expect(new Vector3(7, 2, -4).lengthSq)
        .toBeCloseTo(69, 10);
});

// get angleX(): number;

// get angleY(): number;

// get angleZ(): number;

// get angles(): [number, number];

test(".array", () => {
    expect(new Vector3(3, 0, 0).array)
        .toEqual([3, 0, 0]);
    expect(new Vector3(4, 6, -1).array)
        .toEqual([4, 6, -1]);
    expect(new Vector3(6, 4, 4).array)
        .toEqual([6, 4, 4]);
});

test(".object", () => {
    expect(new Vector3(5, 0, 2).object)
        .toEqual({ x: 5, y: 0, z: 2 });
    expect(new Vector3(23, 24, -6).object)
        .toEqual({ x: 23, y: 24, z: -6 });
    expect(new Vector3(21, -4, -6).object)
        .toEqual({ x: 21, y: -4, z: -6 });
});

test(".string", () => {
    expect(new Vector3(5, 0, 2).string)
        .toBe("(5, 0, 2)");
    expect(new Vector3(4, 6, -1).string)
        .toBe("(4, 6, -1)");
    expect(new Vector3(6, 4, 4).string)
        .toBe("(6, 4, 4)");
});

test(".clone", () => {
    const vec1 = new Vector3(5, 87, 2);
    const vec1Clone = vec1.clone;

    expect(vec1Clone).toEqual(vec1);
    expect(vec1Clone).not.toBe(vec1);


    const vec2 = new Vector3(63, 13, 86);
    const vec2Clone = vec2.clone;
    const vec2CloneClone = vec2Clone.clone;

    expect(vec2Clone).toEqual(vec2);
    expect(vec2CloneClone).toEqual(vec2);
    expect(vec2Clone).not.toBe(vec2);
    expect(vec2CloneClone).not.toBe(vec2);
    expect(vec2CloneClone).not.toBe(vec2Clone);
});

test(".toString()", () => {
    expect(new Vector3(5, 0, 2).toString())
        .toBe("(5, 0, 2)");
    expect(new Vector3(4, 6, -1).toString())
        .toBe("(4, 6, -1)");
    expect(new Vector3(6, 4, 4).toString())
        .toBe("(6, 4, 4)");
});

test(".toFixedString()", () => {
    expect(new Vector3(5.267, 745.23, 3).toFixedString(2))
        .toBe("(5.27, 745.23, 3.00)");
    expect(new Vector3(7.267, 52.8, 9.4).toFixedString(0))
        .toBe("(7, 53, 9)");
    expect(new Vector3(Math.PI, 3.8, 9.43).toFixedString(5))
        .toBe("(3.14159, 3.80000, 9.43000)");
    expect(new Vector3(5.26, 745.234, 4).toFixedString())
        .toBe("(5.2600000000, 745.2340000000, 4.0000000000)");
});

test(".add()", () => {
    const vec1 = new Vector3(3, -2, 0);
    const vec2 = new Vector3(6, 4, -3);
    const result1 = vec1.add(vec2);

    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(9, 2, -3));
    expect(vec2).toEqual(new Vector3(6, 4, -3));

    const vec3 = new Vector3(0, 0, 43);
    const vec4 = new Vector3(-5, 0, -3);
    const result2 = vec3.add(vec4);

    expect(result2).toBe(vec3);
    expect(vec3).toEqual(new Vector3(-5, 0, 40));
    expect(vec4).toEqual(new Vector3(-5, 0, -3));
});

test(".sub()", () => {
    const vec1 = new Vector3(3, -2, 0);
    const vec2 = new Vector3(6, 4, -3);
    const result1 = vec1.sub(vec2);

    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(-3, -6, 3));
    expect(vec2).toEqual(new Vector3(6, 4, -3));

    const vec3 = new Vector3(0, 0, 43);
    const vec4 = new Vector3(5, 0, -3);
    const result2 = vec3.sub(vec4);

    expect(result2).toBe(vec3);
    expect(vec3).toEqual(new Vector3(-5, 0, 46));
    expect(vec4).toEqual(new Vector3(5, 0, -3));
});

test(".mult()", () => {
    const vec1 = new Vector3(5, 3, 7);
    const vec2 = new Vector3(1, 1, 2);
    const result1 = vec1.mult(vec2);

    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(5, 3, 14));
    expect(vec2).toEqual(new Vector3(1, 1, 2));

    const vec3 = new Vector3(4, 2, 1);
    const vec4 = new Vector3(7, 1, 6);
    const result2 = vec3.mult(vec4);

    expect(result2).toBe(vec3);
    expect(vec3).toEqual(new Vector3(28, 2, 6));
    expect(vec4).toEqual(new Vector3(7, 1, 6));
});

test(".matrixMult()", () => {
    const vec = new Vector3(5, -1, 3);
    const mat = new Matrix3(2, 35, 3, 4, 2, 7, 2, 3, -2);
    const result = vec.matrixMult(mat);

    expect(result).toBe(vec);
    expect(vec).toEqual(new Vector3(-16, 39, 1));
    expect(mat).toEqual(new Matrix3(2, 35, 3, 4, 2, 7, 2, 3, -2));
});

test(".div()", () => {
    const vec1 = new Vector3(6, 3, 48);
    const vec2 = new Vector3(3, 1, 4);
    const result1 = vec1.div(vec2);

    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(2, 3, 12));
    expect(vec2).toEqual(new Vector3(3, 1, 4));

    const vec3 = new Vector3(69, 12, 4);
    const vec4 = new Vector3(23, 4, 2);
    const result2 = vec3.div(vec4);

    expect(result2).toBe(vec3);
    expect(vec3).toEqual(new Vector3(3, 3, 2));
    expect(vec4).toEqual(new Vector3(23, 4, 2));
});

test(".scale()", () => {
    const vec1 = new Vector3(3, -2, 0);
    const result1 = vec1.scale(1);

    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(3, -2, 0));

    const vec2 = new Vector3(6, 4, -3);
    const result2 = vec2.scale(5);

    expect(result2).toBe(vec2);
    expect(vec2).toEqual(new Vector3(30, 20, -15));

    const vec3 = new Vector3(-1, 1, 43);
    const result3 = vec3.scale(-2);

    expect(result3).toBe(vec3);
    expect(vec3).toEqual(new Vector3(2, -2, -86));
});

test(".inverseScale()", () => {
    const vec1 = new Vector3(0, -2, 7);
    const result1 = vec1.inverseScale(1);
    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(0, -2, 7));

    const vec2 = new Vector3(6, 4, -12);
    const result2 = vec2.inverseScale(2);
    expect(result2).toBe(vec2);
    expect(vec2).toEqual(new Vector3(3, 2, -6));

    const vec3 = new Vector3(6, 2, -36);
    const result3 = vec3.inverseScale(3);
    expect(result3).toBe(vec3);
    expect(vec3.x).toBeCloseTo(2, 10);
    expect(vec3.y).toBeCloseTo(2 / 3, 10);
    expect(vec3.z).toBeCloseTo(-12, 10);
});

// TODO: inverse(): Vector3

test(".mix()", () => {
    const vec1 = new Vector3(3, -2, 0);
    const vec2 = new Vector3(0, 44, 3);
    const vec3 = new Vector3(5, 4, 2);

    const result1 = vec1.mix(vec3);
    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(4, 1, 1));

    const result2 = vec2.mix(vec3, 0.75);
    expect(result2).toBe(vec2);
    expect(vec2.x).toBeCloseTo(3.75);
    expect(vec2.y).toBeCloseTo(14);
    expect(vec2.z).toBeCloseTo(2.25);
});

test(".norm()", () => {
    const vec1 = new Vector3(7, 0, 0);
    const result1 = vec1.norm();
    expect(result1).toBe(vec1);
    expect(vec1.x).toBeCloseTo(1, 10);
    expect(vec1.y).toBeCloseTo(0, 10);
    expect(vec1.z).toBeCloseTo(0, 10);

    const vec2 = new Vector3(0, 2, -2);
    const result2 = vec2.norm();
    expect(result2).toBe(vec2);
    expect(vec2.x).toBeCloseTo(0, 10);
    expect(vec2.y).toBeCloseTo(Math.SQRT1_2, 10);
    expect(vec2.z).toBeCloseTo(-Math.SQRT1_2, 10);

    const vec3 = new Vector3(-5, 4, -2);
    const result3 = vec3.norm();
    expect(result3).toBe(vec3);
    expect(vec3.length).toBeCloseTo(1, 10);

    const vec4 = new Vector3(7, -32, 3);
    const result4 = vec4.norm(3);
    expect(result4).toBe(vec4);
    expect(result4.length).toBeCloseTo(3, 10);
});

test(".limit()", () => {
    const vec1 = new Vector3(7, 0, 0);
    const result1 = vec1.limit();
    expect(result1).toBe(vec1);
    expect(vec1.x).toBeCloseTo(1, 10);
    expect(vec1.y).toBeCloseTo(0, 10);
    expect(vec1.z).toBeCloseTo(0, 10);

    const vec2 = new Vector3(0, 2, -2);
    const result2 = vec2.limit(5);
    expect(result2).toBe(vec2);
    expect(vec2.x).toBeCloseTo(0, 10);
    expect(vec2.y).toBeCloseTo(2, 10);
    expect(vec2.z).toBeCloseTo(-2, 10);

    const vec3 = new Vector3(-5, 4, -2);
    const result3 = vec3.limit(0.5);
    expect(result3).toBe(vec3);
    expect(vec3.length).toBeCloseTo(0.5, 10);

    const vec4 = new Vector3(6, 0, 4);
    const result4 = vec4.limit(7.5);
    expect(result4).toBe(vec4);
    expect(vec4.x).toBeCloseTo(6, 10);
    expect(vec4.y).toBeCloseTo(0, 10);
    expect(vec4.z).toBeCloseTo(4, 10);

    const vec5 = new Vector3(64, -46, 12);
    const result5 = vec5.limit(12.63);
    expect(result5).toBe(vec5);
    expect(vec5.length).toBeCloseTo(12.63, 10);
});


test(".round()", () => {
    const vec1 = new Vector3(7, 5, 3);
    const result1 = vec1.round();
    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(7, 5, 3));

    const vec2 = new Vector3(0.4, 0.231, 0.051);
    const result2 = vec2.round();
    expect(result2).toBe(vec2);
    expect(vec2).toEqual(new Vector3(0, 0, 0));

    const vec3 = new Vector3(0.7, -0.631, 0.499999);
    const result3 = vec3.round();
    expect(result3).toBe(vec3);
    expect(vec3).toEqual(new Vector3(1, -1, 0));

    const vec4 = new Vector3(52.35, 5.73, -4.5);
    const result4 = vec4.round();
    expect(result4).toBe(vec4);
    expect(vec4).toEqual(new Vector3(52, 6, -4));
});

test(".dot()", () => {
    const vec1 = new Vector3(2, 2, 3);
    const vec2 = new Vector3(1, 5, 7);
    const result = vec1.dot(vec2);
    expect(vec1).toEqual(new Vector3(2, 2, 3));
    expect(vec2).toEqual(new Vector3(1, 5, 7));
    expect(result).toEqual(33);


    const vec3 = new Vector3(-5, 4, 1);
    const vec4 = new Vector3(3, 42, 8);
    expect(vec3.dot(vec4)).toEqual(161);
});

test(".cross()", () => {
    const vec1 = new Vector3(4, 2, 6);
    const vec2 = new Vector3(1, 8, 7);
    const result1 = vec1.cross(vec2);
    expect(result1).toBe(vec1);
    expect(vec1).toEqual(new Vector3(-34, -22, 30));
    expect(vec2).toEqual(new Vector3(1, 8, 7));

    const vec3 = new Vector3(-8, 0, 3);
    const vec4 = new Vector3(5, -2, 6);
    const result2 = vec3.cross(vec4);
    expect(result2).toBe(vec3);
    expect(vec3).toEqual(new Vector3(6, 63, 16));
    expect(vec4).toEqual(new Vector3(5, -2, 6));
});

// reflect(vector: Vector3): Vector3;

// angleBetween(vector: Vector3): number;

// rotateX(angle: number): Vector3;

// rotateY(angle: number): Vector3;

// rotateZ(angle: number): Vector3;

// rotateToX(angle: number): Vector3;

// rotateToY(angle: number): Vector3;

// rotateToZ(angle: number): Vector3;

test(".dist()", () => {
    const vec1 = new Vector3(0, 2, 4);
    const vec2 = new Vector3(0, 3, 4);
    const result1 = vec1.dist(vec2);
    expect(vec1).toEqual(new Vector3(0, 2, 4));
    expect(vec2).toEqual(new Vector3(0, 3, 4));
    expect(result1).toEqual(1);

    const vec3 = new Vector3(4, 2, -5);
    const vec4 = new Vector3(2, 2, -3);
    const result2 = vec3.dist(vec4);
    expect(vec3).toEqual(new Vector3(4, 2, -5));
    expect(vec4).toEqual(new Vector3(2, 2, -3));
    expect(result2).toEqual(Math.sqrt(8));
});

test(".distSq()", () => {
    const vec1 = new Vector3(-5, 0, 2);
    const vec2 = new Vector3(-6, 0, 2);
    const result1 = vec1.distSq(vec2);
    expect(vec1).toEqual(new Vector3(-5, 0, 2));
    expect(vec2).toEqual(new Vector3(-6, 0, 2));
    expect(result1).toEqual(1);

    const vec3 = new Vector3(4, 1, -5);
    const vec4 = new Vector3(2, 3, -3);
    const result2 = vec3.distSq(vec4);
    expect(vec3).toEqual(new Vector3(4, 1, -5));
    expect(vec4).toEqual(new Vector3(2, 3, -3));
    expect(result2).toEqual(12);
});

test(".equalTo()", () => {
    const vec1 = new Vector3(3, 5, 0);
    const vec2 = new Vector3(3, 5, 0);
    const vec3 = new Vector3(53.6, -3, 1.26346);
    const vec4 = new Vector3(53.6, -3, 1.26346);
    const vec5 = new Vector3(545, 53.2, -74);

    // self equal
    expect(vec1.equalTo(vec1)).toEqual(true);
    expect(vec2.equalTo(vec2)).toEqual(true);
    expect(vec3.equalTo(vec3)).toEqual(true);
    expect(vec4.equalTo(vec4)).toEqual(true);
    expect(vec5.equalTo(vec5)).toEqual(true);

    // equal to same values
    expect(vec1.equalTo(vec2)).toEqual(true);
    expect(vec3.equalTo(vec4)).toEqual(true);
    expect(vec2.equalTo(vec1)).toEqual(true);
    expect(vec4.equalTo(vec3)).toEqual(true);

    // not equal to different values
    expect(vec1.equalTo(vec3)).toEqual(false);
    expect(vec2.equalTo(vec4)).toEqual(false);
    expect(vec3.equalTo(vec5)).toEqual(false);
    expect(vec1.equalTo(vec5)).toEqual(false);
});


test(".equalToSoft()", () => {
    const vec1 = new Vector3(3, 5, 0);
    const vec2 = new Vector3(3.001, 5, 0.004);
    expect(vec1.equalToSoft(vec2)).toEqual(true);

    const vec3 = new Vector3(74.5, 0.333, 0);
    const vec4 = new Vector3(74.5, 1 / 3, -0.003);
    expect(vec3.equalToSoft(vec4)).toEqual(true);

    const vec5 = new Vector3(4, 4, 4);
    const vec6 = new Vector3(4, 4.4, 3.7);
    expect(vec5.equalToSoft(vec6)).toEqual(false);

    const vec7 = new Vector3(4, 4, 4);
    const vec8 = new Vector3(4, 4.5, 5);
    expect(vec7.equalToSoft(vec8, 2)).toEqual(true);

    const vec9 = new Vector3(-5, 3, 2);
    const vec10 = new Vector3(-5, 3.001, 2);
    expect(vec9.equalToSoft(vec10, 0.0001)).toEqual(false);

    expect(vec1.equalToSoft(vec3)).toEqual(false);
    expect(vec2.equalToSoft(vec4)).toEqual(false);
    expect(vec2.equalToSoft(vec6)).toEqual(false);
    expect(vec3.equalToSoft(vec8)).toEqual(false);
    expect(vec5.equalToSoft(vec9)).toEqual(false);
});

// clampToZero( epsilon: number = 1e-2): Vector3