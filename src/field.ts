import { Material, MaterialShaderCode } from "./material";
import { Vec3Input, Value, ValueTypes, FloatInput, Variable, clearVariableIdentifiers, parseVec3Input, parseFloatInput, Uniform } from "./value";

let vertShader: string
let fragTemplate: string;


async function init() {
    const
        vertRequest = fetch("shader.vert").then((res) => res.text()),
        fragRequest = fetch("shader.frag").then((res) => res.text());

    [vertShader, fragTemplate] = await Promise.all([vertRequest, fragRequest]);
}


export interface ShaderCode<T extends ValueTypes> {
    body: string;
    result: Value<T>;
}


export abstract class AbstractField {
    getProgram(): [string, string, Uniform<ValueTypes, unknown>[]] {
        const position = new Variable<"vec3">;
        const {
            body: sdfBody,
            result: distance
        } = this.getCode(position);
        const {
            body: matfBody,
            result: material
        } = this.getMaterialCode(position);

        const uniforms = this.getUniforms();
        const uniformDeclarations = uniforms.map((uni) => uni.getDeclaration()).join("\n");

        const sdf = `float sdf(vec3 ${position}) {${sdfBody}\n    return ${distance};\n}`;
        const matf = `Material matf(vec3 ${position}) {${matfBody}\n    return ${material};\n}`

        const fragShader = fragTemplate
            .replace("#WORLD_UNIFORMS", uniformDeclarations)
            .replace("#SDF_FUNCTION", sdf)
            .replace("#MATERIAL_FUNCTION", matf);


        clearVariableIdentifiers();

        return [vertShader, fragShader, uniforms];
    }

    abstract getCode(positionInput: Vec3Input): ShaderCode<"float">;
    abstract getMaterialCode(positionInput: Vec3Input): MaterialShaderCode;
    abstract getUniforms(): Uniform<ValueTypes, unknown>[];
}


export abstract class PrimitiveField extends AbstractField {
    material: Material

    constructor(material: Material) {
        super();
        this.material = material;
    }

    getCode(positionInput: Vec3Input) {
        return this.getPrimitiveCode(positionInput);
    }

    getMaterialCode() {
        return this.material.getCode();
    }

    getUniforms(): Uniform<ValueTypes, unknown>[] {
        return [...this.getSelfUniforms(), ...this.material.getUniforms()];
    }

    abstract getPrimitiveCode(positionInput: Vec3Input): ShaderCode<"float">;
    abstract getSelfUniforms(): Uniform<ValueTypes, unknown>[];
}


export abstract class CompoundField extends AbstractField {
    protected children: AbstractField[];

    constructor(...children: AbstractField[]) {
        super();
        this.children = children;
    }

    getCode(positionInput: Vec3Input) {

        const {
            body: positionBody,
            result: transformedPosition
        } = this.getPositionCode(positionInput);

        const childBodies: string[] = [];
        const childDistances: FloatInput[] = [];
        for (const child of this.children) {
            const { body, result } = child.getCode(transformedPosition);
            childBodies.push(body);
            childDistances.push(result);
        }

        const {
            body: distanceBody,
            result: transformedDistance
        } = this.getDistanceCode(...childDistances);

        return {
            body: `${positionBody}${childBodies.join("")}${distanceBody}`,
            result: transformedDistance
        }
    }

    getMaterialCode(positionInput: Vec3Input): MaterialShaderCode {

        const {
            body: positionBody,
            result: transformedPosition
        } = this.getPositionCode(positionInput);

        const childBodies: string[] = [];
        const childDistances: FloatInput[] = [];
        for (const child of this.children) {
            const { body, result } = child.getCode(transformedPosition);
            childBodies.push(body);
            childDistances.push(result);
        }

        const {
            body: materialBody,
            result,
        } = this.getSelfMaterialCode(positionInput, ...childDistances);

        const body = `${positionBody}${childBodies.join("")}${materialBody}`;

        return {
            body,
            result
        }
    }

    getUniforms() {
        const uniforms: Uniform<ValueTypes, unknown>[] = [];

        for (const child of this.children) {
            uniforms.push(...child.getUniforms());
        }

        uniforms.push(...this.getSelfUniforms());

        return uniforms;
    }

    getPositionCode(positionInput: Vec3Input): ShaderCode<"vec3"> {
        return { body: "", result: parseVec3Input(positionInput) };
    }

    getDistanceCode(...distanceInput: FloatInput[]): ShaderCode<"float"> {
        return { body: "", result: parseFloatInput(distanceInput[0]) };
    }

    abstract getSelfMaterialCode(positionInput: Vec3Input, ...distanceInputs: FloatInput[]): MaterialShaderCode;
    abstract getSelfUniforms(): Uniform<ValueTypes, unknown>[];
}

export abstract class FirstMaterialCompoundField extends CompoundField {
    getMaterialCode(positionInput: Vec3Input) {
        const {
            body: positionBody,
            result: transformedPosition
        } = this.getPositionCode(positionInput);

        const {
            body: materialBody,
            result
        } = this.children[0].getMaterialCode(transformedPosition);

        return {
            body: `${positionBody}${materialBody}`,
            result
        };
    }

    getSelfMaterialCode(): never {
        throw Error("Can't run getSelfMaterialCode() on FirstMaterialCompoundField");
    }
}

await init();