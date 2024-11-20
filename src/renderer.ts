import * as twgl from "twgl.js";

enum State {
    Stopped,
    Running,
    WaitingForProgram
}

export class Renderer {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    bufferInfo: twgl.BufferInfo;
    programInfo: twgl.ProgramInfo | null = null;

    programVersion = 0;
    nextProgramVersion = 1;
    state = State.Stopped;
    frameHandle: number | null = null;

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl");
        if (gl === null) throw Error("No WEBGL support");
        this.gl = gl;
        this.canvas = canvas;

        const arrays = {
            position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0], // screen quad
        };
        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    }

    start() {
        if (this.state === State.Running) return;

        if (this.programInfo) {
            this.state = State.Running;
            this.requestFrame();
        } else {
            this.state = State.WaitingForProgram;
        }
    }

    stop() {
        if (this.frameHandle === null) return;

        cancelAnimationFrame(this.frameHandle);
        this.state = State.Stopped;
        this.frameHandle = null;
    }

    requestFrame() {
        this.frameHandle = requestAnimationFrame(this.frame.bind(this));
    }

    frame(_time: number) {
        this.frameHandle = null;

        if (!this.programInfo) {
            this.state = State.WaitingForProgram;
            return;
        };

        const gl = this.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
        twgl.drawBufferInfo(gl, this.bufferInfo);

        this.requestFrame();
    }

    setProgram(vertexSource: string, fragmentSource: string) {
        twgl.createProgramInfo(this.gl, [vertexSource, fragmentSource], {
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
        if (this.state === State.WaitingForProgram) this.start();
    }

    onProgramError(msg: string, _lineOffset?: number) {
        this.stop();
        throw Error("Program compilation failed at:\n" + msg);
    }
}