import { Matrix3 } from "./matrix3";
import { FrameEvent, Renderer } from "./renderer";
import { SmoothSubtraction, SmoothUnion } from "./sdfCombination";
import { Box, Sphere } from "./sdfPrimative";
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
world.sdf =
    new Rotate(rotation,
        new SmoothUnion(0.2,
            new Translate(new Vector3(-0.4, 0, -5),
                new Box(new Vector3(0.4, 1.2, 0.4))),
            new Translate(new Vector3(0.4, 0, -5),
                new Sphere(0.6))
        ));

const renderer = new Renderer(canvas, world);

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock({ unadjustedMovement: true });
});

canvas.addEventListener("mousemove", async (event) => {
    if (document.pointerLockElement !== canvas) return;
    world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
});

renderer.addEventListener("frame", (event) => {
    if (!(event instanceof FrameEvent)) return;
    rotation.setValue(Matrix3.rotateY(event.time * 0.0001));
})

renderer.start();