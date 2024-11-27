import { FrameEvent, Renderer } from "./renderer";
import { World } from "./world";

interface Hooks<T> {
    start: () => T;
    frame?: (state: T, time: number, delta: number) => void;
}

export class Controller<T> {
    canvas: HTMLCanvasElement;
    world: World;
    renderer: Renderer;
    hooks: Hooks<T>;
    pressedKeys = new Set<String>();
    state!: T;

    constructor(world: World, hooks: Hooks<T>) {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement))
            throw Error("Canvas not found");
        this.canvas = canvas;

        this.world = world;
        this.renderer = new Renderer(canvas, world);
        this.hooks = hooks;

        canvas.addEventListener("click", this.onClick.bind(this));
        canvas.addEventListener("mousemove", this.onMouseMove.bind(this))
        canvas.addEventListener("keydown", this.onKeyDown.bind(this));
        canvas.addEventListener("keyup", this.onKeyUp.bind(this));

        this.renderer.addEventListener("frame", this.onFrame.bind(this));
    }

    start() {
        this.state = this.hooks.start();
        console.log(this.world.field)
        this.renderer.start();
    }

    async onClick() {
        await this.canvas.requestPointerLock({ unadjustedMovement: true });
    }

    onMouseMove(event: MouseEvent) {
        if (document.pointerLockElement !== this.canvas) return;
        this.world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
    }

    onKeyDown(event: KeyboardEvent) {
        this.pressedKeys.add(event.code);
    }

    onKeyUp(event: KeyboardEvent) {
        this.pressedKeys.delete(event.code);
    }

    onFrame(event: Event) {
        if (!(event instanceof FrameEvent)) return;
        if (this.hooks.frame)
            this.hooks.frame(this.state, event.time, event.delta);
    }
}