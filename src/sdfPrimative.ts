import { PrimitiveSdf } from "./sdf";
import { filterUniforms, FloatInput, parseFloatInput, parseVec3Input, Uniform, Value, ValueTypes, Variable, Vec3Input } from "./sdfValue";

export class Empty extends PrimitiveSdf {
    constructor() {
        super();
    }

    getUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getPrimitiveCode(_positionInput: Vec3Input) {
        const result = new Variable<"float">();

        const body = `
    float ${result} = 1.0 / 0.0;`;

        return {
            body,
            result
        }
    }
}

export class Sphere extends PrimitiveSdf {
    radius: Value<"float">;

    constructor(radiusInput: FloatInput) {
        super();
        this.radius = parseFloatInput(radiusInput);
    }

    getUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.radius]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const result = new Variable<"float">();

        const body = `
    float ${result} = length(${position}) - ${this.radius};`;

        return {
            body,
            result
        }
    }
}

export class Box extends PrimitiveSdf {
    size: Value<"vec3">;

    constructor(sizeInput: Vec3Input) {
        super();
        this.size = parseVec3Input(sizeInput);
    }

    getUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.size]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const q = new Variable<"vec3">();
        const result = new Variable<"float">();

        const body = `
    vec3 ${q} = abs(${position}) - ${this.size};
    float ${result} = length(max(${q}, 0.0)) + min(max(${q}.x, max(${q}.y, ${q}.z)), 0.0);`;

        return {
            body,
            result
        }
    }
}