import { FrameEvent, Renderer } from "./renderer";
import { World } from "./world";


interface Hooks<T> {
    start: (world: World) => T;
    frame?: (context: Controller<T>, time: number, delta: number) => void;
}

export class Controller<T> {
    canvas: HTMLCanvasElement;
    world: World;
    renderer: Renderer;
    hooks: Hooks<T>;
    keysHeld = new Set<String>();
    state!: T;

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
        if (this.hooks.frame)
            this.hooks.frame(this, event.time, event.delta);
    }
}