import { FrameEvent, Renderer } from "./renderer";
import { World } from "./world";

interface Hooks<T> {
    start: (world: World) => T;
    frame?: (context: Controller<T>, time: number, delta: number) => void;
}

const FPS_POLL_RATE = 1000;

export class Controller<T> {
    canvas: HTMLCanvasElement;
    world: World;
    renderer: Renderer;
    hooks: Hooks<T>;
    keysHeld = new Set<String>();
    state!: T;

    fpsStartTime = 0.0;
    fpsFrameCount = 0;
    minDelta = Infinity;
    maxDelta = 0;

    constructor(hooks: Hooks<T>) {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement))
            throw Error("Canvas not found");
        this.canvas = canvas;

        this.world = new World();
        this.renderer = new Renderer(canvas, this.world);
        this.hooks = hooks;

        canvas.addEventListener("click", this.onClick.bind(this));
        canvas.addEventListener("mousemove", this.onMouseMove.bind(this))
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        this.renderer.addEventListener("frame", this.onFrame.bind(this));
    }

    start() {
        this.state = this.hooks.start(this.world);
        this.renderer.start();
    }

    isKeyDown(code: string) {
        return this.keysHeld.has(code);
    }

    private async onClick() {
        await this.canvas.requestPointerLock({ unadjustedMovement: true });
    }

    private onMouseMove(event: MouseEvent) {
        if (document.pointerLockElement !== this.canvas) return;
        this.world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
    }

    private onKeyDown(event: KeyboardEvent) {
        this.keysHeld.add(event.code);
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keysHeld.delete(event.code);
    }

    private onFrame(event: Event) {
        if (!(event instanceof FrameEvent)) return;

        this.fpsFrameCount++;
        this.minDelta = Math.min(this.minDelta, event.delta);
        this.maxDelta = Math.max(this.maxDelta, event.delta);
        if (event.time > this.fpsStartTime + FPS_POLL_RATE) {
            if (this.fpsStartTime > 0) {
                const fpsNums = [
                    1000 / this.minDelta,
                    this.fpsFrameCount / (event.time - this.fpsStartTime) * 1000,
                    1000 / this.maxDelta];
                const fpsStrs = fpsNums.map((num) => String(Math.round(num * 10) / 10).padEnd(5, " "))
                console.clear();
                console.info(`FPS: High ${fpsStrs[0]} Average ${fpsStrs[1]} Low ${fpsStrs[2]}`);
            }
            this.fpsFrameCount = 0;
            this.fpsStartTime = event.time;
            this.minDelta = Infinity;
            this.maxDelta = 0;
        }


        if (this.hooks.frame)
            this.hooks.frame(this, event.time, event.delta);
    }
}