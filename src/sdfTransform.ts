import { AbstractSdf, CompoundSdf, ShaderCode } from "./sdf";
import { filterUniforms, FloatInput, inverseMat3, Mat3Input, parseFloatInput, parseMat3Input, parseVec3Input, Value, Variable, Vec3Input } from "./sdfValue";

export class Translate extends CompoundSdf {
    declare children: [AbstractSdf];
    translation: Value<"vec3">;

    constructor(translation: Vec3Input, child: AbstractSdf) {
        super(child);
        this.translation = parseVec3Input(translation);
    }

    getSelfUniforms() {
        return filterUniforms([this.translation]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<"vec3"> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<"vec3">();

        const body = `
    vec3 ${transformedPosition} = ${position} - ${this.translation};`;

        return { body, result: transformedPosition };
    }
}

export class Rotate extends CompoundSdf {
    declare children: [AbstractSdf];
    inverseRotation: Value<"mat3">;

    constructor(rotation: Mat3Input, child: AbstractSdf) {
        super(child);
        this.inverseRotation = inverseMat3(parseMat3Input(rotation));
    }

    getSelfUniforms() {
        return filterUniforms([this.inverseRotation]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<"vec3"> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<"vec3">();

        const body = `
    vec3 ${transformedPosition} = ${this.inverseRotation} * ${position};`;

        return { body, result: transformedPosition };
    }
}

export class Scale extends CompoundSdf {
    declare children: [AbstractSdf];
    scaling: Value<"float">;

    constructor(scaling: FloatInput, child: AbstractSdf) {
        super(child);
        this.scaling = parseFloatInput(scaling);
    }

    getSelfUniforms() {
        return filterUniforms([this.scaling]);
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<"vec3"> {
        const position = parseVec3Input(positionInput);
        const transformedPosition = new Variable<"vec3">();

        const body = `
    vec3 ${transformedPosition} = ${position} / ${this.scaling};`;

        return { body, result: transformedPosition };
    }

    getDistanceCode(distanceInput: FloatInput): ShaderCode<"float"> {
        const distance = parseFloatInput(distanceInput);
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${transformedDistance} = ${distance} * ${this.scaling};`;

        return { body, result: transformedDistance };
    }
}

export class Round extends CompoundSdf {
    declare children: [AbstractSdf];
    strength: Value<"float">;

    constructor(strength: FloatInput, child: AbstractSdf) {
        super(child);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms() {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(distanceInput: FloatInput): ShaderCode<"float"> {
        const distance = parseFloatInput(distanceInput);
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${transformedDistance} = ${distance} - ${this.strength};`;

        return { body, result: transformedDistance };
    }
}