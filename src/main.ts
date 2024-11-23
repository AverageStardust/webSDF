import { Matrix3 } from "./matrix3";
import { Renderer } from "./renderer";
import { Sphere } from "./sdfPrimative";
import { Rotate, Translate } from "./sdfTransform";
import { Mat3Uniform } from "./sdfValue";
import { Vector3 } from "./vector3";
import { World } from "./world";

const canvas = document.getElementById("canvas");
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw Error("Canvas not found");

const world = new World();
world.camera.fov = 120;

const rotation = new Mat3Uniform(Matrix3.identity());
world.sdf = new Rotate(rotation, new Translate(new Vector3(0, 0, -5), new Sphere(0.8)));

const renderer = new Renderer(canvas, world);

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock({ unadjustedMovement: true });
});

canvas.addEventListener("mousemove", async (event) => {
    if (document.pointerLockElement !== canvas) return;
    world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
});

renderer.addEventListener("frame", () => {
    rotation.setValue(rotation.getValue().mult(Matrix3.rotateY(0.001)));
})

renderer.start();