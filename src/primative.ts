import { PrimitiveField } from "./field";
import { Material } from "./material";
import { filterUniforms, FloatInput, parseFloatInput, parseVec3Input, Uniform, Value, ValueTypes, Variable, Vec3Input } from "./value";

export class Empty extends PrimitiveField {
    constructor() {
        super(Material.zero());
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getPrimitiveCode(_positionInput: Vec3Input) {
        const result = new Variable<"float">();

        const body = `
    float ${result} = INFINITY;`;

        return {
            body,
            result
        }
    }
}

export class Sphere extends PrimitiveField {
    radius: Value<"float">;

    constructor(radiusInput: FloatInput, material: Material) {
        super(material);
        this.radius = parseFloatInput(radiusInput);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
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

export class Box extends PrimitiveField {
    size: Value<"vec3">;

    constructor(sizeInput: Vec3Input, material: Material) {
        super(material);
        this.size = parseVec3Input(sizeInput);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
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