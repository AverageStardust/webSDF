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

float castRay(vec3 position, vec3 direction, float init_t) {
    float t = init_t;
    
    float distance = sdf(position + direction * t);
    while(distance > 0.01) {
        t += distance;
        if(t > farPlane) return farPlane;
        distance = sdf(position + direction * t);
    };

    return t;
}

void main() {
    vec3 direction = normalize(vec3(screenCoord * viewport, -nearPlane));
    direction *= cameraRotation;

    vec3 worldPosition = cameraPosition + castRay(cameraPosition, direction, nearPlane) * direction;

    if(length(worldPosition) > 100.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        fragColor = vec4(mod(worldPosition, 1.0), 1.0);
    }
}