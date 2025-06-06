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
        const result = new Variable<ValueTypes.Float>();

        const body = `
    float ${result} = INFINITY;`;

        return {
            body,
            result
        }
    }
}

export class Sphere extends PrimitiveField {
    radius: Value<ValueTypes.Float>;

    constructor(radiusInput: FloatInput, material: Material) {
        super(material);
        this.radius = parseFloatInput(radiusInput);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.radius]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const result = new Variable<ValueTypes.Float>();

        const body = `
    float ${result} = length(${position}) - ${this.radius};`;

        return {
            body,
            result
        }
    }
}

export class Box extends PrimitiveField {
    size: Value<ValueTypes.Vec3>;

    constructor(sizeInput: Vec3Input, material: Material) {
        super(material);
        this.size = parseVec3Input(sizeInput);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.size]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const q = new Variable<ValueTypes.Vec3>();
        const result = new Variable<ValueTypes.Float>();

        const body = `
    vec3 ${q} = abs(${position}) - ${this.size};
    float ${result} = length(max(${q}, 0.0)) + min(max(${q}.x, max(${q}.y, ${q}.z)), 0.0);`;

        return {
            body,
            result
        }
    }
}

export class Torus extends PrimitiveField {
    major: Value<ValueTypes.Float>;
    minor: Value<ValueTypes.Float>;

    constructor(major: FloatInput, minor: FloatInput, material: Material) {
        super(material);
        this.major = parseFloatInput(major);
        this.minor = parseFloatInput(minor);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.major, this.minor]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const q = new Variable<ValueTypes.Vec3>();
        const result = new Variable<ValueTypes.Float>();

        const body = `
    vec2 ${q} = vec2(length(${position}.xz) - ${this.major}, ${position}.y);
    float ${result} = length(${q}) - ${this.minor};`

        return {
            body,
            result
        }
    }
}

export class Capsule extends PrimitiveField {
    height: Value<ValueTypes.Float>;
    radius: Value<ValueTypes.Float>;

    constructor(height: FloatInput, radius: FloatInput, material: Material) {
        super(material);
        this.height = parseFloatInput(height);
        this.radius = parseFloatInput(radius);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.height, this.radius]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const y = new Variable<ValueTypes.Float>();
        const result = new Variable<ValueTypes.Float>();

        const body = `
    float ${y} = clamp(${position}.y, 0.0, ${this.height});
    float ${result} = length(${position} - vec3(0.0, ${y}, 0.0)) - ${this.radius};`

        return {
            body,
            result
        }
    }
}

export class Cylinder extends PrimitiveField {
    height: Value<ValueTypes.Float>;
    radius: Value<ValueTypes.Float>;

    constructor(height: FloatInput, radius: FloatInput, material: Material) {
        super(material);
        this.height = parseFloatInput(height);
        this.radius = parseFloatInput(radius);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.height, this.radius]);
    }

    getPrimitiveCode(positionInput: Vec3Input) {
        const position = parseVec3Input(positionInput);
        const d = new Variable<ValueTypes.Vec3>();
        const result = new Variable<ValueTypes.Float>();

        const body = `
    vec2 ${d} = abs(vec2(length(${position}.xz), ${position}.y)) - vec2(${this.radius}, ${this.height});
    float ${result} = min(max(${d}.x, ${d}.y), 0.0) + length(max(${d}, 0.0)); `

        return {
            body,
            result
        }
    }
}
