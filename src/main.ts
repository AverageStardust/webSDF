import { Renderer } from "./renderer";

const canvas = document.getElementById("canvas");
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw Error("Canvas not found");

const renderer = new Renderer(canvas);
renderer.setProgram(`
attribute vec3 position;
varying vec2 texCoord;

void main() {
    texCoord = position.xy;
    vec4 positionVec4 = vec4(position, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
}`, `
precision mediump float;
varying vec2 texCoord;

void main() {
    vec2 uv = texCoord;
    gl_FragColor = vec4(uv, 0.0, 1.0);
}`);
renderer.start();