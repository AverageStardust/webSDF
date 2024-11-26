import { AbstractSdf, CompoundSdf, ShaderCode } from "./sdf";
import { filterUniforms, FloatInput, parseFloatInput, Uniform, Value, ValueTypes, Variable } from "./sdfValue";

export class Union extends CompoundSdf {
    constructor(...children: AbstractSdf[]) {
        super(...children);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<"float"> {
        const distances = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<"float">();
        const distancesString = distances.map(String).join(", ");

        const body = `
    float ${transformedDistance} = min(${distancesString});`;

        return { body, result: transformedDistance };
    }
}

export class Intersection extends CompoundSdf {
    constructor(...children: AbstractSdf[]) {
        super(...children);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<"float"> {
        const distances = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<"float">();
        const distancesString = distances.map(String).join(", ");

        const body = `
    float ${transformedDistance} = max(${distancesString});`;

        return { body, result: transformedDistance };
    }
}

export class Subtraction extends CompoundSdf {
    declare children: [AbstractSdf, AbstractSdf];

    constructor(minuend: AbstractSdf, subtrahend: AbstractSdf) {
        super(minuend, subtrahend);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: [FloatInput, FloatInput]): ShaderCode<"float"> {
        const [minuendDistance, subtrahendDistance] = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${transformedDistance} = max(${minuendDistance}, -1.0 * ${subtrahendDistance});`;

        return { body, result: transformedDistance };
    }
}

export class SmoothUnion extends CompoundSdf {
    declare children: [AbstractSdf, AbstractSdf];

    strength: Value<"float">;

    constructor(strength: FloatInput, childA: AbstractSdf, childB: AbstractSdf) {
        super(childA, childB);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<"float"> {
        const [distanceA, distanceB] = distanceInputs.map(parseFloatInput);
        const h = new Variable<"float">();
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${h} = clamp(0.5 + 0.5 * (${distanceB} - ${distanceA}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${distanceB}, ${distanceA}, ${h}) - ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }
}

export class SmoothIntersection extends CompoundSdf {
    declare children: [AbstractSdf, AbstractSdf];

    strength: Value<"float">;

    constructor(strength: FloatInput, childA: AbstractSdf, childB: AbstractSdf) {
        super(childA, childB);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<"float"> {
        const [distanceA, distanceB] = distanceInputs.map(parseFloatInput);
        const h = new Variable<"float">();
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${h} = clamp(0.5 - 0.5 * (${distanceB} - ${distanceA}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${distanceB}, ${distanceA}, ${h}) + ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }
}

export class SmoothSubtraction extends CompoundSdf {
    declare children: [AbstractSdf, AbstractSdf];

    strength: Value<"float">;

    constructor(strength: FloatInput, minuend: AbstractSdf, subtrahend: AbstractSdf) {
        super(minuend, subtrahend);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<"float"> {
        const [minuendDistance, subtrahendDistance] = distanceInputs.map(parseFloatInput);
        const h = new Variable<"float">();
        const transformedDistance = new Variable<"float">();

        const body = `
    float ${h} = clamp(0.5 - 0.5 * (${minuendDistance} + ${subtrahendDistance}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${minuendDistance}, -1.0 * ${subtrahendDistance}, ${h}) + ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }
}