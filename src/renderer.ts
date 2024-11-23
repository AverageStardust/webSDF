import * as twgl from "twgl.js";
import { World } from "./world";

enum State {
    Stopped,
    Running,
    WaitingForProgram
}

export class Renderer {
    gl: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
    world: World;

    bufferInfo: twgl.BufferInfo;
    programInfo: twgl.ProgramInfo | null = null;

    programVersion = 0;
    nextProgramVersion = 1;
    state = State.Stopped;
    frameHandle: number | null = null;

    constructor(canvas: HTMLCanvasElement, world: World) {
        const gl = canvas.getContext("webgl2");
        if (gl === null) throw Error("No WEBGL 2.0 support");
        this.gl = gl;
        this.canvas = canvas;

        this.world = world;

        const arrays = {
            position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0], // screen quad
        };
        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    }

    start() {
        if (this.state === State.Running) return;
        this.state = State.Running;
        this.requestFrame();
    }

    stop() {
        if (this.frameHandle === null) return;

        cancelAnimationFrame(this.frameHandle);
        this.state = State.Stopped;
        this.frameHandle = null;
    }

    requestFrame() {
        this.frameHandle = requestAnimationFrame(this.frame.bind(this));
        if (!this.world.sdf.isNew) return;
        this.setProgram(...this.world.sdf.getProgram());
    }

    frame(time: number) {
        this.frameHandle = null;

        if (!this.programInfo) {
            this.state = State.WaitingForProgram;
            return;
        };

        const gl = this.gl, canvas = this.canvas, world = this.world;
        gl.viewport(0, 0, canvas.width, canvas.height);

        const uniforms = {
            time: time * 0.001,
            resolution: [canvas.width, canvas.height],
            viewport: world.camera.getViewport(canvas.width, canvas.height),
            nearPlane: world.camera.nearPlane,
            farPlane: world.camera.farPlane,
            cameraPosition: world.camera.position.array,
            cameraRotation: world.camera.rotation.array
        };

        gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(gl, this.bufferInfo);

        this.requestFrame();
    }

    setProgram(vertSource: string, fragSource: string) {
        twgl.createProgramInfo(this.gl, [vertSource, fragSource], {
            callback: this.onProgramCompiled.bind(this, this.nextProgramVersion),
            errorCallback: this.onProgramError.bind(this)
        });
        this.nextProgramVersion++;
    }

    onProgramCompiled(version: number, _error?: string, result?: WebGLProgram | twgl.ProgramInfo) {
        if (!result) {
            throw Error("Unexpected program compilation result: undefined result");
        } else if (result instanceof WebGLProgram) {
            throw Error("Unexpected program compilation result: WebGLProgram not twgl.ProgramInfo");
        }

        if (version <= this.programVersion) return;

        this.programInfo = result;
        this.programVersion = version;
        if (this.state === State.WaitingForProgram)
            this.start();
    }

    onProgramError(msg: string, _lineOffset?: number) {
        this.stop();
        throw Error("Program compilation failed at:\n" + msg);
    }
}