import { Renderer } from "./renderer";
import { Sphere } from "./sdfPrimative";
import { Translate } from "./sdfTransform";
import { Vector3 } from "./vector3";
import { World } from "./world";

const canvas = document.getElementById("canvas");
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw Error("Canvas not found");

const world = new World();
world.sdf = new Translate(new Vector3(0, 0, -5), new Sphere(0.8));

const renderer = new Renderer(canvas, world);

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock({ unadjustedMovement: true });
});
canvas.addEventListener("mousemove", async (event) => {
    if (document.pointerLockElement !== canvas) return;
    world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
});

renderer.start();