#version 300 es

precision highp float;

in vec2 screenCoord;

uniform vec2 viewport;
uniform float nearRadius;
uniform float farRadius;
uniform vec3 cameraPosition;
uniform mat3 cameraRotation;

#WORLD_UNIFORMS

out vec4 fragColor;

#SDF_FUNCTION

float castRay(vec3 position, vec3 direction, float init_t) {
    float t = init_t;
    
    float distance = sdf(position + direction * t);
    while(distance > 0.001) {
        t += distance;
        if(t > farRadius) return farRadius;
        distance = sdf(position + direction * t);
    };

    return t;
}

void main() {
    vec3 direction = normalize(vec3(screenCoord * viewport, -nearRadius));
    direction *= cameraRotation;

    float t = castRay(cameraPosition, direction, nearRadius);

    if(t >= farRadius) {
        fragColor = vec4(direction * 0.2 + 0.5, 1.0);
    } else {
        fragColor = vec4(mod(cameraPosition + t * direction, 1.0), 1.0);
    }
}