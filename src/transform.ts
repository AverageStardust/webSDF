import { AbstractField, ShaderCode, FirstMaterialCompoundField } from "./field";
import { filterUniforms, FloatInput, inverseMat3, Mat3Input, parseFloatInput, parseMat3Input, parseVec3Input, Value, ValueTypes, Variable, Vec3Input } from "./value";

export class Translate extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    translation: Value<ValueTypes.Vec3>;

    constructor(translation: Vec3Input, child: AbstractField) {
        super(child);
        this.translation = parseVec3Input(translation);
    }

    getSelfUniforms() {
        return filterUniforms([this.translation]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${transformedPosition} = ${position} - ${this.translation};`;

        return { body, result: transformedPosition };
    }
}

export class Rotate extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    inverseRotation: Value<ValueTypes.Mat3>;

    constructor(rotation: Mat3Input, child: AbstractField) {
        super(child);
        this.inverseRotation = inverseMat3(parseMat3Input(rotation));
    }

    getSelfUniforms() {
        return filterUniforms([this.inverseRotation]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${transformedPosition} = ${this.inverseRotation} * ${position};`;

        return { body, result: transformedPosition };
    }
}

export class Scale extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    scaling: Value<ValueTypes.Float>;

    constructor(scaling: FloatInput, child: AbstractField) {
        super(child);
        this.scaling = parseFloatInput(scaling);
    }

    getSelfUniforms() {
        return filterUniforms([this.scaling]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${transformedPosition} = ${position} / ${this.scaling};`;

        return { body, result: transformedPosition };
    }

    getDistanceCode(distanceInput: FloatInput): ShaderCode<ValueTypes.Float> {
        const distance = parseFloatInput(distanceInput);
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${transformedDistance} = ${distance} * ${this.scaling};`;

        return { body, result: transformedDistance };
    }
}

export class Round extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    strength: Value<ValueTypes.Float>;

    constructor(strength: FloatInput, child: AbstractField) {
        super(child);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms() {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(distanceInput: FloatInput): ShaderCode<ValueTypes.Float> {
        const distance = parseFloatInput(distanceInput);
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${transformedDistance} = ${distance} - ${this.strength};`;

        return { body, result: transformedDistance };
    }
}

export class RepetitionSymetric extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    size: Value<ValueTypes.Vec3>;

    constructor(size: Vec3Input, child: AbstractField) {
        super(child);
        this.size = parseVec3Input(size);
    }

    getSelfUniforms() {
        return filterUniforms([this.size]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${transformedPosition} = ${position} - ${this.size} * round(${position} / ${this.size});`

        return { body, result: transformedPosition };
    }
}

export class LimitedRepetitionSymetric extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    size: Value<ValueTypes.Vec3>;
    limit: Value<ValueTypes.Vec3>;

    constructor(size: Vec3Input, limit: Vec3Input, child: AbstractField) {
        super(child);
        this.size = parseVec3Input(size);
        this.limit = parseVec3Input(limit);
    }

    getSelfUniforms() {
        return filterUniforms([this.size, this.limit]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${transformedPosition} = ${position} - ${this.size} * clamp(round(${position} / ${this.size}), -${this.limit}, ${this.limit});`

        return { body, result: transformedPosition };
    }
}


export class RepetitionMirrored extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    size: Value<ValueTypes.Vec3>;

    constructor(size: Vec3Input, child: AbstractField) {
        super(child);
        this.size = parseVec3Input(size);
    }

    getSelfUniforms() {
        return filterUniforms([this.size]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const i = new Variable<ValueTypes.Vec3>();
        const r = new Variable<ValueTypes.Vec3>();
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${i} = round(${position} / ${this.size});
    vec3 ${r} = ${position} - ${this.size} * ${i};
    vec3 ${transformedPosition} = vec3(((int(${i}.x) & 1) == 0) ? ${r}.x : -${r}.x,
                                       ((int(${i}.y) & 1) == 0) ? ${r}.y : -${r}.y,
                                       ((int(${i}.z) & 1) == 0) ? ${r}.z : -${r}.z);`

        return { body, result: transformedPosition };
    }
}

export class LimitedRepetitionMirrored extends FirstMaterialCompoundField {
    declare children: [AbstractField];
    size: Value<ValueTypes.Vec3>;
    limit: Value<ValueTypes.Vec3>;

    constructor(size: Vec3Input, limit: Vec3Input, child: AbstractField) {
        super(child);
        this.size = parseVec3Input(size);
        this.limit = parseVec3Input(limit);
    }

    getSelfUniforms() {
        return filterUniforms([this.size, this.limit]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<ValueTypes.Vec3> {
        const position = parseVec3Input(positionInput);
        const i = new Variable<ValueTypes.Vec3>();
        const r = new Variable<ValueTypes.Vec3>();
        const transformedPosition = new Variable<ValueTypes.Vec3>();

        const body = `
    vec3 ${i} = clamp(round(${position} / ${this.size}), -${this.limit}, ${this.limit});
    vec3 ${r} = ${position} - ${this.size} * ${i};
    vec3 ${transformedPosition} = vec3(((int(${i}.x) & 1) == 0) ? ${r}.x : -${r}.x,
                                       ((int(${i}.y) & 1) == 0) ? ${r}.y : -${r}.y,
                                       ((int(${i}.z) & 1) == 0) ? ${r}.z : -${r}.z);`

        return { body, result: transformedPosition };
    }
}