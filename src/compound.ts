import { AbstractField, CompoundField, FirstMaterialCompoundField, ShaderCode } from "./field";
import { MaterialShaderCode, mixMaterial } from "./material";
import { filterUniforms, FloatInput, parseFloatInput, Uniform, Value, ValueTypes, Variable, Vec3Input } from "./value";

export class Union extends CompoundField {
    constructor(...children: AbstractField[]) {
        super(...children);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<ValueTypes.Float> {
        const distances = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<ValueTypes.Float>();
        const distancesString = distances.map(String).join(", ");

        const body = `
    float ${transformedDistance} = min(${distancesString});`;

        return { body, result: transformedDistance };
    }

    getSelfMaterialCode(positionInput: Vec3Input, ...distanceInputs: FloatInput[]): MaterialShaderCode {
        const distances = distanceInputs.map(parseFloatInput);
        const minDistance = new Variable<ValueTypes.Float>();
        const result = new Variable<ValueTypes.Material>;

        const distancesString = distances.map(String).join(", ");
        let body = `
    float ${minDistance} = min(${distancesString});
    Material ${result};`;

        for (let i = 0; i < distances.length; i++) {
            const {
                body: childBody,
                result: childResult
            } = this.children[i].getMaterialCode(positionInput);

            const statement = i ? " else if" : "\nif";

            body = body.concat(`\
    ${statement} (${minDistance} == ${distances[i]}) {${childBody}
    ${result} = ${childResult};
    }`);
        }

        return {
            body,
            result
        }
    }
}

export class Intersection extends FirstMaterialCompoundField {
    constructor(...children: AbstractField[]) {
        super(...children);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<ValueTypes.Float> {
        const distances = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<ValueTypes.Float>();
        const distancesString = distances.map(String).join(", ");

        const body = `
    float ${transformedDistance} = max(${distancesString});`;

        return { body, result: transformedDistance };
    }
}

export class Subtraction extends FirstMaterialCompoundField {
    declare children: [AbstractField, AbstractField];

    constructor(minuend: AbstractField, subtrahend: AbstractField) {
        super(minuend, subtrahend);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return [];
    }

    getDistanceCode(...distanceInputs: [FloatInput, FloatInput]): ShaderCode<ValueTypes.Float> {
        const [minuendDistance, subtrahendDistance] = distanceInputs.map(parseFloatInput);
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${transformedDistance} = max(${minuendDistance}, -1.0 * ${subtrahendDistance});`;

        return { body, result: transformedDistance };
    }
}

export class SmoothUnion extends CompoundField {
    declare children: [AbstractField, AbstractField];

    strength: Value<ValueTypes.Float>;

    constructor(strength: FloatInput, childA: AbstractField, childB: AbstractField) {
        super(childA, childB);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<ValueTypes.Float> {
        const [distanceA, distanceB] = distanceInputs.map(parseFloatInput);
        const h = new Variable<ValueTypes.Float>();
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${h} = clamp(0.5 + 0.5 * (${distanceB} - ${distanceA}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${distanceB}, ${distanceA}, ${h}) - ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }

    getSelfMaterialCode(positionInput: Vec3Input, ...distanceInputs: [FloatInput, FloatInput]): MaterialShaderCode {
        const [distanceA, distanceB] = distanceInputs.map(parseFloatInput);
        const [materialA, materialB] = this.children.map((c) => c.getMaterialCode(positionInput));
        const h = new Variable<ValueTypes.Float>();

        const {
            body: mixBody,
            result
        } = mixMaterial(materialB, materialA, h);

        const body = `
    float ${h} = clamp(0.5 + 0.5 * (${distanceB} - ${distanceA}) / ${this.strength}, 0.0, 1.0);${mixBody}`

        return { body, result };
    }
}

export class SmoothIntersection extends FirstMaterialCompoundField {
    declare children: [AbstractField, AbstractField];

    strength: Value<ValueTypes.Float>;

    constructor(strength: FloatInput, childA: AbstractField, childB: AbstractField) {
        super(childA, childB);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<ValueTypes.Float> {
        const [distanceA, distanceB] = distanceInputs.map(parseFloatInput);
        const h = new Variable<ValueTypes.Float>();
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${h} = clamp(0.5 - 0.5 * (${distanceB} - ${distanceA}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${distanceB}, ${distanceA}, ${h}) + ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }
}

export class SmoothSubtraction extends FirstMaterialCompoundField {
    declare children: [AbstractField, AbstractField];

    strength: Value<ValueTypes.Float>;

    constructor(strength: FloatInput, minuend: AbstractField, subtrahend: AbstractField) {
        super(minuend, subtrahend);
        this.strength = parseFloatInput(strength);
    }

    getSelfUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.strength]);
    }

    getDistanceCode(...distanceInputs: FloatInput[]): ShaderCode<ValueTypes.Float> {
        const [minuendDistance, subtrahendDistance] = distanceInputs.map(parseFloatInput);
        const h = new Variable<ValueTypes.Float>();
        const transformedDistance = new Variable<ValueTypes.Float>();

        const body = `
    float ${h} = clamp(0.5 - 0.5 * (${minuendDistance} + ${subtrahendDistance}) / ${this.strength}, 0.0, 1.0);
    float ${transformedDistance} = mix(${minuendDistance}, -1.0 * ${subtrahendDistance}, ${h}) + ${this.strength} * ${h} * (1.0 - ${h});`

        return { body, result: transformedDistance };
    }
}