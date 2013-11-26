precision mediump float;
uniform samplerCube texUnit;
uniform vec3 diffuseCoeff;
uniform sampler2D diffuseTex;
uniform int texturingEnabled;
//varying vec3 fragEnvNormal, fragEnvViewDir;
varying vec2 tCoord;
varying vec3 fragPosition, fragNormal;
void main() {
    /*vec3 viewDir = normalize(fragEnvViewDir);
    vec3 normal = normalize(fragNormal);
    vec3 reflectedViewDir = reflect(-viewDir, normal);
    vec3 envColor = textureCube(texUnit, reflectedViewDir).rgb;
    gl_FragColor = vec4(envColor,1.0);*/
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}