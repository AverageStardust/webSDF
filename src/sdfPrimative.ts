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