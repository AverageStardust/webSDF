#version 300 es

in vec3 position;
out vec2 screenCoord;

void main() {
    screenCoord = position.xy * 0.5 - 0.25;
    vec4 positionVec4 = vec4(position, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
}