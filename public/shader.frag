#version 300 es

precision highp float;

in vec2 screenCoord;

uniform vec2 viewport;
uniform float nearPlane;
uniform float farPlane;
uniform vec3 cameraPosition;
uniform mat3 cameraRotation;

out vec4 fragColor;

#SDF_FUNCTION

vec3 castRay(vec3 position, vec3 direction, float init_t) {
    float t = init_t;
    
    float distance;
    do {
        distance = sdf(position + direction * t);
        t += distance;
    } while(distance > 0.01 && t < farPlane);

    return position + direction * t;
}

void main() {
    vec3 direction = normalize(vec3(screenCoord * viewport, -nearPlane));
    direction *= cameraRotation;

    vec3 worldPosition = castRay(cameraPosition, direction, nearPlane);

    fragColor = vec4(worldPosition, 1.0);
}