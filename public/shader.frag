#version 300 es

#define INFINITY 3.4028234E38
#define EPSILON 1E-4
#define REFLECTION_STEPS 8
#define REFLECTION_CUTOFF 0.001
#define LIGHT_POSITION vec3(-2.0, 4.0, -2.0)
#define LIGHT_RADIUS 0.1
#define LIGHT_COLOR vec3(50.0, 50.0, 50.0)
#define AO_RANGE 0.3

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

struct LightCast {
    bool hit;
    vec3 color;
};

float lengthSq(vec3 vec) {
    return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
}

float distToLine(vec3 start, vec3 differance, vec3 point) {
    float t = dot(point - start, differance) / lengthSq(differance);
    t = clamp(t, 0.0, 1.0);
    vec3 closestPoint = start + t * differance;
    return length(point - closestPoint);
}


Material mix(Material a, Material b, float ratio) {
    return Material(
        sqrt(mix(a.diffuse * a.diffuse, b.diffuse * b.diffuse, ratio)),
        sqrt(mix(a.specular * a.specular, b.specular * b.specular, ratio)));
}

#SDF_FUNCTION

#MATERIAL_FUNCTION

vec3 normf(vec3 position) {
    return normalize(vec3(
        sdf(position + vec3(EPSILON, 0.0, 0.0)) - sdf(position - vec3(EPSILON, 0.0, 0.0)),
        sdf(position + vec3(0.0, EPSILON, 0.0)) - sdf(position - vec3(0.0, EPSILON, 0.0)),
        sdf(position + vec3(0.0, 0.0, EPSILON)) - sdf(position - vec3(0.0, 0.0, EPSILON))
    ));
}

float castRay(vec3 position, vec3 direction, float initalT, float maxT) {
    float t = initalT;
    
    float distance = sdf(position + direction * t);
    while(distance > EPSILON * 0.5) {
        t += distance;
        if(t > maxT) return INFINITY;
        distance = sdf(position + direction * t);
    };

    return t;
}

float castOcclusion(vec3 position, vec3 normal) {
    float t = castRay(position, normal, EPSILON, AO_RANGE * 2.0);

    float sampleDistance;
    if (t > AO_RANGE * 2.0) {
        sampleDistance = AO_RANGE;
    } else {
        sampleDistance = t * 0.5;
    }
    
    float sampleRadius = sdf(position + sampleDistance * normal);

    return sampleRadius / sampleDistance * 0.6 + 0.4;
}

LightCast castLight(vec3 position, vec3 direction, float t) {
    float dist = distToLine(position, position + t * direction, LIGHT_POSITION);
    if (dist < LIGHT_RADIUS) {
        float distanceSq = lengthSq(LIGHT_POSITION - position);
        return LightCast(true, LIGHT_COLOR / distanceSq);
    }

    return LightCast(false, vec3(0.0));
}

vec3 castDiffuse(vec3 position, vec3 normal, vec3 lightPosition, vec3 lightColor) {
    vec3 direction = normalize(lightPosition - position);
    float t = castRay(position, direction, EPSILON, farRadius);
    float distanceSq = lengthSq(lightPosition - position);

    if (t * t + EPSILON < distanceSq) {
        return vec3(0.0);
    }

    float intensity = max(dot(direction, normal), 0.0) / distanceSq;
    float occlusion = castOcclusion(position, normal);

    return lightColor * intensity * occlusion;
}

vec3 skyColor(vec3 direction) {
    return vec3(direction * 0.2 + 0.2);
}

vec3 castReflectedRay(vec3 position, vec3 direction) {
    float t = castRay(position, direction, nearRadius, farRadius);
    LightCast lightCast = castLight(position, direction, min(t, farRadius));

    if(lightCast.hit) return lightCast.color;

    if (t >= farRadius) {
        return skyColor(direction);
    }

    position += t * direction;
    vec3 normal = normf(position);
    direction = reflect(direction, normal);
    Material mat = matf(position);
    position += normal * EPSILON;
   
    vec3 diffuseLight = castDiffuse(position, normal, LIGHT_POSITION, LIGHT_COLOR);
    vec3 color = diffuseLight * mat.diffuse;
    vec3 specular = mat.specular;

    for(int i = 0; i < REFLECTION_STEPS; i++) {
        if (lengthSq(specular) < REFLECTION_CUTOFF) break;

        float t = castRay(position, direction, EPSILON, farRadius);
        LightCast lightCast = castLight(position, direction, t);

        if (lightCast.hit) {
            color += lightCast.color * specular;
            break;
        }

        if (t >= farRadius) {
            color += skyColor(direction) * mat.specular;
            break;
        }

        position += t * direction;
        vec3 normal = normf(position);
        direction = reflect(direction, normal);
        Material mat = matf(position);
        position += normal * EPSILON;

        vec3 diffuseLight = castDiffuse(position, normal, LIGHT_POSITION, LIGHT_COLOR);
        color += diffuseLight * mat.diffuse * specular;
        specular = mat.specular;
    }

    return color;
}

void main() {
    vec3 direction = normalize(vec3(screenCoord * viewport, -nearRadius));
    direction *= cameraRotation;

    fragColor = vec4(castReflectedRay(cameraPosition, direction), 1.0);
}