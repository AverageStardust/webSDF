import { Vector3 } from "./vector3";

export type ValueTypes = "float" | "vec3";

export type FloatInput = number | Value<"float">;
export type Vec3Input = Vector3 | Value<"vec3">;

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

export function clearIdentifier(group: keyof typeof identifierGroups) {
    identifierGroups[group].clear();
}

export function parseFloatInput(input: FloatInput): Value<"float"> {
    if (typeof input === "number") {
        let str = String(input);
        if (!str.includes(".")) str = str.concat(".0");
        return new Const<"float">(str);
    } else {
        return input;
    }
}

export function parseVec3Input(input: Vec3Input): Value<"vec3"> {
    if (typeof input === "number") {
        return new Const<"vec3">("vec3" + input);
    } else {
        return input;
    }
}

export abstract class Value<_T extends ValueTypes> {
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

export class Const<T extends ValueTypes> extends Value<T> {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    toString() {
        return this.value;
    }
}


export class Uniform<T extends ValueTypes> extends Identifier<T> {
    constructor() {
        super("uni");
    }
}

export class Variable<T extends ValueTypes> extends Identifier<T> {
    constructor() {
        super("var");
    }
}