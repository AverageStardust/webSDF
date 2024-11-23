import { Matrix3 } from "./matrix3";
import { Vector3 } from "./vector3";

export type ValueTypes = "float" | "vec3" | "mat3";

export type FloatInput = number | Value<"float">;
export type Vec3Input = Vector3 | Value<"vec3">;
export type Mat3Input = Matrix3 | Value<"mat3">;

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

export function parseFloatInput(input: FloatInput): Value<"float"> {
    if (typeof input === "number") {
        return new Expression<"float">(toFloat(input));
    } else {
        return input;
    }
}

export function parseVec3Input(input: Vec3Input): Value<"vec3"> {
    if (input instanceof Vector3) {
        const contents = input.array.map(toFloat).join(", ");
        return new Expression<"vec3">(`vec3(${contents})`);
    } else {
        return input;
    }
}

export function parseMat3Input(input: Mat3Input): Value<"mat3"> {
    if (input instanceof Matrix3) {
        const contents = input.transposeArray.map(toFloat).join(", ");
        return new Expression<"mat3">(`mat3(${contents})`);
    } else {
        return input;
    }
}

export function inverseMat3(input: Value<"mat3">): Value<"mat3"> {
    if (input instanceof Mat3Uniform) {
        return new InverseMat3Uniform(input.value);
    } else if (input instanceof InverseMat3Uniform) {
        return new Mat3Uniform(input.value);
    } else if (input instanceof Expression || input instanceof Variable) {
        return new Expression<"mat3">(`inverse(${input})`);
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
    value: U;

    constructor(value: U) {
        super("uni");
        this.value = value;
    }

    abstract getValue(): unknown;
}

export class FloatUniform extends Uniform<"float", number> {
    getValue() {
        return this.value;
    }
}

export class Vec3Uniform extends Uniform<"vec3", Vector3> {
    getValue() {
        return this.value.array;
    }
}

export class Mat3Uniform extends Uniform<"mat3", Matrix3> {
    getValue() {
        return this.value.transposeArray;
    }
}

class InverseMat3Uniform extends Uniform<"mat3", Matrix3> {
    getValue() {
        const inverse = this.value.clone.inverse();
        if (inverse === null) throw Error("Failed to evaluate inverse of mat3");
        return inverse.transposeArray;
    }
}

export class Variable<T extends ValueTypes> extends Identifier<T> {
    constructor() {
        super("var");
    }
}