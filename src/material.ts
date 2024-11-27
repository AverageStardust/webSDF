import { filterUniforms, FloatInput, parseFloatInput, parseVec3Input, Uniform, Value, ValueTypes, Variable, Vec3Input } from "./value";
import { Vector3 } from "./vector3";

export interface MaterialShaderCode {
    body: string;
    result: Value<"Material">;
}

export class Material {
    diffuse: Value<"vec3">;
    specular: Value<"vec3">;

    static zero() {
        return new Material(Vector3.zero(), Vector3.zero());
    }

    constructor(diffuseInput: Vec3Input, specularInput: Vec3Input) {
        this.diffuse = parseVec3Input(diffuseInput);
        this.specular = parseVec3Input(specularInput);
    }

    getCode(): MaterialShaderCode {
        const material = new Variable<"Material">();

        return {
            body: `
    Material ${material} = Material(${this.diffuse}, ${this.specular});`,
            result: material
        };
    }

    getUniforms(): Uniform<ValueTypes, unknown>[] {
        return filterUniforms([this.diffuse, this.specular]);
    }
}

export function mixMaterial(materialA: MaterialShaderCode, materialB: MaterialShaderCode, ratioInput: FloatInput): MaterialShaderCode {
    const ratio = parseFloatInput(ratioInput);

    const result = new Variable<"Material">;

    const {
        body: materialABody,
        result: aResult
    } = materialA;
    const {
        body: materialBBody,
        result: bResult
    } = materialB;

    const body = `${materialABody}${materialBBody}
    Material ${result} = mix(${aResult}, ${bResult}, ${ratio});
    `;

    return {
        body,
        result
    };
}