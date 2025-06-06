import { Matrix3 } from "./matrix3";
import { Vector3 } from "./vector3";

export enum ValueTypes {
    Float,
    Vec3,
    Mat3,
    Material,
}

export type FloatInput = number | Value<ValueTypes.Float>;
export type Vec3Input = Vector3 | Value<ValueTypes.Vec3>;
export type Mat3Input = Matrix3 | Value<ValueTypes.Mat3>;

const identifierGroups = {
    uni: new Set<number>(),
    var: new Set<number>()
};

export function getIdentifier(group: keyof typeof identifierGroups) {
    let identifierNumbers = identifierGroups[group];

    let number;
    do {
        number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    } while (identifierNumbers.has(number));

    return `_${group}${number}_`;
}

function clearIdentifiers(group: keyof typeof identifierGroups) {
    identifierGroups[group].clear();
}

export function clearVariableIdentifiers() {
    clearIdentifiers("var");
}

export function filterUniforms(values: Value<ValueTypes>[]): Uniform<ValueTypes, unknown>[] {
    return values.filter((val) => val instanceof Uniform);
}

export function parseFloatInput(input: FloatInput): Value<ValueTypes.Float> {
    if (typeof input === "number") {
        return new Expression<ValueTypes.Float>(toFloat(input));
    } else {
        return input;
    }
}

export function parseVec3Input(input: Vec3Input): Value<ValueTypes.Vec3> {
    if (input instanceof Vector3) {
        const contents = input.array.map(toFloat).join(", ");
        return new Expression<ValueTypes.Vec3>(`vec3(${contents})`);
    } else {
        return input;
    }
}

export function parseMat3Input(input: Mat3Input): Value<ValueTypes.Mat3> {
    if (input instanceof Matrix3) {
        const contents = input.transposeArray.map(toFloat).join(", ");
        return new Expression<ValueTypes.Mat3>(`mat3(${contents})`);
    } else {
        return input;
    }
}

export function inverseMat3(input: Value<ValueTypes.Mat3>): Value<ValueTypes.Mat3> {
    if (input instanceof Mat3Uniform || input instanceof InverseMat3Uniform) {
        return input.getInverse();
    } else if (input instanceof Expression || input instanceof Variable) {
        return new Expression<ValueTypes.Mat3>(`inverse(${input})`);
    } else {
        throw Error("Failed to compile inverse of mat3");
    }
}

function toFloat(value: number) {
    let str = String(value);
    if (!str.includes(".")) str = str.concat(".0");
    return str;
}

export abstract class Value<_T extends ValueTypes> {
    declare OPAQUE_SHADER_VALUE: never;
    abstract toString(): string;
}

abstract class Identifier<T extends ValueTypes> extends Value<T> {
    identifier: string;

    constructor(group: keyof typeof identifierGroups) {
        super();
        this.identifier = getIdentifier(group);
    }

    toString() {
        return this.identifier;
    }
}

export class Expression<T extends ValueTypes> extends Value<T> {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    toString() {
        return this.value;
    }
}


export abstract class Uniform<T extends ValueTypes, U> extends Identifier<T> {
    protected value: U;

    constructor(value: U) {
        super("uni");
        this.value = value;
    }

    setValue(value: U) {
        this.value = value;
    }

    abstract getValue(): unknown;
    abstract getShaderValue(): unknown;
    abstract getDeclaration(): unknown;
}

export class FloatUniform extends Uniform<ValueTypes.Float, number> {
    getValue() {
        return this.value;
    }

    getShaderValue() {
        return this.value;
    }

    getDeclaration() {
        return `uniform float ${this.identifier};`;
    }
}

export class Vec3Uniform extends Uniform<ValueTypes.Vec3, Vector3> {
    getValue() {
        return this.value.clone;
    }

    getShaderValue() {
        return this.value.array;
    }

    getDeclaration() {
        return `uniform vec3 ${this.identifier};`;
    }
}

export class Mat3Uniform extends Uniform<ValueTypes.Mat3, Matrix3> {
    getValue() {
        return this.value.clone;
    }

    getInverse() {
        return new InverseMat3Uniform(this);
    }

    getShaderValue() {
        return this.value.transposeArray;
    }

    getDeclaration() {
        return `uniform mat3 ${this.identifier};`;
    }
}

class InverseMat3Uniform extends Uniform<ValueTypes.Mat3, Mat3Uniform> {
    getValue() {
        const inverse = this.value.getValue().clone.inverse();
        if (!inverse)
            throw Error("Failed to find inverse of mat3 uniform");
        return inverse;
    }

    getInverse() {
        return this.value;
    }

    getShaderValue() {
        return this.getValue().transposeArray;
    }

    getDeclaration() {
        return `uniform mat3 ${this.identifier};`;
    }
}

export class Variable<T extends ValueTypes> extends Identifier<T> {
    constructor() {
        super("var");
    }
}