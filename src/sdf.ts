import { Vec3Input, Value, ValueTypes, FloatInput, Variable, clearVariableIdentifiers, parseVec3Input, parseFloatInput, Uniform } from "./sdfValue";

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


export abstract class AbstractSdf {
    abstract isNew: boolean;

    getProgram(): [string, string, Uniform<ValueTypes, unknown>[]] {
        const position = new Variable<"vec3">;
        const {
            body: sdfBody,
            result: distance
        } = this.getCode(position);

        const uniforms = this.getUniforms();
        const uniformDeclarations = uniforms.map((uni) => uni.getDeclaration()).join("\n");

        const sdf = `float sdf(vec3 ${position}) {${sdfBody}\n    return ${distance};\n}`;

        const fragShader = fragTemplate
            .replace("#WORLD_UNIFORMS", uniformDeclarations)
            .replace("#SDF_FUNCTION", sdf);

        clearVariableIdentifiers();

        return [vertShader, fragShader, uniforms];
    }

    abstract getUniforms(): Uniform<ValueTypes, unknown>[]

    abstract getCode(positionInput: Vec3Input): ShaderCode<"float">;
}


export abstract class PrimitiveSdf extends AbstractSdf {
    isNew = true;

    getCode(positionInput: Vec3Input) {
        this.isNew = false;
        return this.getPrimitiveCode(positionInput);
    }

    abstract getPrimitiveCode(positionInput: Vec3Input): ShaderCode<"float">
}


export abstract class CompoundSdf extends AbstractSdf {
    protected children: AbstractSdf[];
    protected isSelfNew = true;

    constructor(...children: AbstractSdf[]) {
        super();
        this.children = children;
    }

    get isNew() {
        if (this.isSelfNew) return true;

        for (const child of this.children) {
            if (child.isNew) return true;
        }

        return false;
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

        this.isSelfNew = false;
        return {
            body: `${positionBody}${childBodies.join("")}${distanceBody}`,
            result: transformedDistance
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


    abstract getSelfUniforms(): Uniform<ValueTypes, unknown>[]

    getPositionCode(positionInput: Vec3Input): ShaderCode<"vec3"> {
        return { body: "", result: parseVec3Input(positionInput) };
    }

    getDistanceCode(...distanceInput: FloatInput[]): ShaderCode<"float"> {
        return { body: "", result: parseFloatInput(distanceInput[0]) };
    }
}

await init();