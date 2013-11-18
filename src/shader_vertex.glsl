attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 projT, viewT, modelT, normalT;
varying vec2 tCoord;
varying vec3 fragPosition, fragNormal;
void main() {
    fragPosition = (modelT * vec4(position, 1.0)).xyz;
    fragNormal = normalize((normalT * vec4(normal, 0.0)).xyz);
    tCoord = texCoord;
    gl_Position = projT * viewT * modelT * vec4(position, 1.0);
}