#version 300 es

#define INFINITY 3.4028234E38
precision highp float;

in vec2 screenCoord;

uniform vec2 viewport;
uniform float nearRadius;
uniform float farRadius;
uniform vec3 cameraPosition;
uniform mat3 cameraRotation;

#WORLD_UNIFORMS

out vec4 fragColor;

struct Material {
    vec3 diffuse;
    vec3 specular;
};

Material mix(Material a, Material b, float ratio) {
    return Material(
        sqrt(mix(a.diffuse * a.diffuse, b.diffuse * b.diffuse, ratio)),
        sqrt(mix(a.specular * a.specular, b.specular * b.specular, ratio)));
}

#SDF_FUNCTION

#MATERIAL_FUNCTION

float castRay(vec3 position, vec3 direction, float initalT) {
    float t = initalT;
    
    float distance = sdf(position + direction * t);
    while(distance > 0.001) {
        t += distance;
        if(t > farRadius) return INFINITY;
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
        vec3 worldPosition = cameraPosition + t * direction;
        Material material = matf(worldPosition);
        fragColor = vec4(material.diffuse, 1.0);
    }
}