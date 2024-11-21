type Matrix3Array = [number, number, number, number, number, number, number, number, number];

export class Matrix3 {
    a: number; b: number; c: number;
    d: number; e: number; f: number;
    g: number; h: number; i: number;

    static zero() {
        return new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0);
    }

    static identity() {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1);
    }

    static fromArray(array: Matrix3Array): Matrix3 {
        return new Matrix3(...array);
    }

    static rotateX(angle: number): Matrix3 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix3(
            1, 0, 0,
            0, cos, -sin,
            0, sin, cos
        );
    }

    static rotateY(angle: number): Matrix3 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix3(
            cos, 0, sin,
            0, 1, 0,
            -sin, 0, cos
        );
    }

    static rotateZ(angle: number): Matrix3 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix3(
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        );
    }

    static scale(xScale: number, yScale?: number, zScale?: number): Matrix3 {
        yScale ??= xScale;
        zScale ??= yScale;
        return new Matrix3(
            xScale, 0, 0,
            0, yScale, 0,
            0, 0, zScale
        )
    }

    constructor(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;
    }

    get array(): Matrix3Array {
        return [
            this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i];
    }

    get determinant(): number {
        return (
            this.a * (this.e * this.i - this.f * this.h) -
            this.b * (this.d * this.i - this.f * this.g) +
            this.c * (this.d * this.h - this.e * this.g));
    }

    get clone(): Matrix3 {
        return new Matrix3(
            this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i);
    }

    add(matrix: Matrix3): Matrix3 {
        this.a += matrix.a;
        this.b += matrix.b;
        this.c += matrix.c;
        this.d += matrix.d;
        this.e += matrix.e;
        this.f += matrix.f;
        this.g += matrix.g;
        this.h += matrix.h;
        this.i += matrix.i;
        return this;
    }

    sub(matrix: Matrix3): Matrix3 {
        this.a -= matrix.a;
        this.b -= matrix.b;
        this.c -= matrix.c;
        this.d -= matrix.d;
        this.e -= matrix.e;
        this.f -= matrix.f;
        this.g -= matrix.g;
        this.h -= matrix.h;
        this.i -= matrix.i;
        return this;
    }

    mult(matrix: Matrix3): Matrix3 {
        const tempA = this.a * matrix.a + this.b * matrix.d + this.c * matrix.g;
        const tempB = this.a * matrix.b + this.b * matrix.e + this.c * matrix.h;
        const tempC = this.a * matrix.c + this.b * matrix.f + this.c * matrix.i;
        const tempD = this.d * matrix.a + this.e * matrix.d + this.f * matrix.g;
        const tempE = this.d * matrix.b + this.e * matrix.e + this.f * matrix.h;
        const tempF = this.d * matrix.c + this.e * matrix.f + this.f * matrix.i;
        const tempG = this.g * matrix.a + this.h * matrix.d + this.i * matrix.g;
        const tempH = this.g * matrix.b + this.h * matrix.e + this.i * matrix.h;
        const tempI = this.g * matrix.c + this.h * matrix.f + this.i * matrix.i;

        this.a = tempA;
        this.b = tempB;
        this.c = tempC;
        this.d = tempD;
        this.e = tempE;
        this.f = tempF;
        this.g = tempG;
        this.h = tempH;
        this.i = tempI;

        return this;
    }

    scale(scalar: number): Matrix3 {
        this.a *= scalar;
        this.b *= scalar;
        this.c *= scalar;
        this.d *= scalar;
        this.e *= scalar;
        this.f *= scalar;
        this.g *= scalar;
        this.h *= scalar;
        this.i *= scalar;
        return this;
    }

    inverseScale(scalar: number): Matrix3 {
        const inverseScalar = 1 / scalar;
        this.a *= inverseScalar;
        this.b *= inverseScalar;
        this.c *= inverseScalar;
        this.d *= inverseScalar;
        this.e *= inverseScalar;
        this.f *= inverseScalar;
        this.g *= inverseScalar;
        this.h *= inverseScalar;
        this.i *= inverseScalar;
        return this;
    }

    inverse(): Matrix3 | null {
        const determinant = this.determinant;
        if (determinant == 0) return null;

        const inverseDeterminant = 1 / determinant;
        const inverseA = (this.e * this.i - this.f * this.h) * inverseDeterminant;
        const inverseB = (this.c * this.h - this.b * this.i) * inverseDeterminant;
        const inverseC = (this.b * this.f - this.c * this.e) * inverseDeterminant;
        const inverseD = (this.f * this.g - this.d * this.i) * inverseDeterminant;
        const inverseE = (this.a * this.i - this.c * this.g) * inverseDeterminant;
        const inverseF = (this.c * this.d - this.a * this.f) * inverseDeterminant;
        const inverseG = (this.d * this.h - this.e * this.g) * inverseDeterminant;
        const inverseH = (this.b * this.g - this.a * this.h) * inverseDeterminant;
        const inverseI = (this.a * this.e - this.b * this.d) * inverseDeterminant;

        this.a = inverseA;
        this.b = inverseB;
        this.c = inverseC;
        this.d = inverseD;
        this.e = inverseE;
        this.f = inverseF;
        this.g = inverseG;
        this.h = inverseH;
        this.i = inverseI;

        return this;
    }

    transpose(): Matrix3 {
        const temp1 = this.b;
        this.b = this.d;
        this.d = temp1;

        const temp2 = this.c;
        this.c = this.g;
        this.g = temp2;

        const temp3 = this.f;
        this.f = this.h;
        this.h = temp3;

        return this;
    }
}