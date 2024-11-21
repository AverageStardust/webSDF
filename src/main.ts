import { Renderer } from "./renderer";
import { World } from "./world";

const canvas = document.getElementById("canvas");
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw Error("Canvas not found");

const world = new World();
const renderer = new Renderer(canvas, world);

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock({ unadjustedMovement: true });
});
canvas.addEventListener("mousemove", async (event) => {
    if (document.pointerLockElement !== canvas) return;
    world.camera.look(event.movementX * -0.001, event.movementY * -0.001);
});

renderer.setProgram(`
attribute vec3 position;

varying vec2 screenCoord;

void main() {
    screenCoord = position.xy - 0.5;
    vec4 positionVec4 = vec4(position, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
}`, `
precision highp float;

varying vec2 screenCoord;

uniform vec2 viewport;
uniform float nearPlane;
uniform mat3 cameraRotation;

void main() {
    vec3 viewDirection = normalize(vec3(screenCoord * viewport * 0.5, -nearPlane));
    viewDirection *= cameraRotation;
    gl_FragColor = vec4(viewDirection, 1.0);
}`);
renderer.start();