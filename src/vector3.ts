export class Vector3 {
    x: number;
    y: number;
    z: number;

    static zero() {
        return new Vector3(0, 0, 0);
    }

    static up() {
        return new Vector3(0, 1, 0);
    }

    static down() {
        return new Vector3(0, -1, 0);
    }

    static right() {
        return new Vector3(1, 0, 0);
    }

    static left() {
        return new Vector3(-1, 0, 0);
    }

    static backward() {
        return new Vector3(0, 0, 1);
    }

    static forward() {
        return new Vector3(0, 0, -1);
    }

    static fromArray([x, y, z]: [number, number, number]): Vector3 {
        return new Vector3(x, y, z);
    }

    static fromObject({ x, y, z }: { x: number, y: number, z: number }): Vector3 {
        return new Vector3(x, y, z);
    }

    // TODO: static fromAngles(theta: number, phi: number, length: number): Vector3

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get length(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    get lengthSq(): number {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    // TODO: get angleX(): number

    // TODO: get angleY(): number

    // TODO: get angleZ(): number

    // TODO: get angles(): [number, number]

    // TODO: get inverse(): Vector3

    get array(): [number, number, number] {
        return [this.x, this.y, this.z];
    }

    get object(): { x: number, y: number, z: number } {
        return { x: this.x, y: this.y, z: this.z };
    }

    get string(): string {
        return this.toString();
    }

    get clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`
    }

    toFixedString(precision: number = 10): string {
        return `(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
    }

    add(vector: Vector3): Vector3 {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    sub(vector: Vector3): Vector3 {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }

    mult(vector: Vector3): Vector3 {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    }

    div(vector: Vector3): Vector3 {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
    }

    scale(scalar: number): Vector3 {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    inverseScale(scalar: number): Vector3 {
        const inverseScalar = 1 / scalar;
        this.x *= inverseScalar;
        this.y *= inverseScalar;
        this.z *= inverseScalar;
        return this;
    }

    mix(vector: Vector3, amount: number = 0.5): Vector3 {
        this.x += (vector.x - this.x) * amount;
        this.y += (vector.y - this.y) * amount;
        this.z += (vector.z - this.z) * amount;
        return this;
    }

    norm(targetLength: number = 1): Vector3 {
        const inverseLength = targetLength / this.length;
        this.x *= inverseLength;
        this.y *= inverseLength;
        this.z *= inverseLength;
        return this;
    }

    limit(maxLength: number = 1): Vector3 {
        const newLength = Math.min(this.length, maxLength);
        this.norm(newLength);
        return this;
    }

    round(): Vector3 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    cross(vector: Vector3): Vector3 {
        const oldX = this.x;
        this.x = this.y * vector.z - this.z * vector.y;
        const oldY = this.y;
        this.y = this.z * vector.x - oldX * vector.z;
        this.z = oldX * vector.y - oldY * vector.x;

        return this;
    }

    // TODO: reflect(vector: Vector3): Vector3

    // TODO: angleBetween(vector: Vector3): number

    // TODO: rotateX(angle: number): Vector3

    // TODO: rotateY(angle: number): Vector3

    // TODO: rotateZ(angle: number): Vector3

    // TODO: rotateToX(angle: number): Vector3

    // TODO: rotateToY(angle: number): Vector3

    // TODO: rotateToZ(angle: number): Vector3

    dist(vector: Vector3): number {
        return Math.hypot(vector.x - this.x, vector.y - this.y, vector.z - this.z);
    }

    distSq(vector: Vector3): number {
        return (
            (vector.x - this.x) ** 2 +
            (vector.y - this.y) ** 2 +
            (vector.z - this.z) ** 2);
    }

    equalTo(vector: Vector3): boolean {
        return this.x === vector.x && this.y === vector.y && this.z === vector.z;
    }

    equalToSoft(vector: Vector3, epsilon: number = 1e-2): boolean {
        const differenceSum = (
            Math.abs(this.x - vector.x) +
            Math.abs(this.y - vector.y) +
            Math.abs(this.z - vector.z)
        )
        return differenceSum <= epsilon;
    }

    // TODO: clampToZero( epsilon: number = 1e-2): Vector3
}