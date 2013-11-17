precision mediump float;
uniform vec3 lightPosition;
uniform vec3 ambient;
uniform vec3 diffuseCoeff;
uniform sampler2D diffuseTex;
uniform int texturingEnabled;
varying vec2 tCoord;
varying vec3 fragPosition, fragNormal;
void main() {
    float costheta = max(dot(normalize(-fragPosition), normalize(fragNormal)), 0.0);
    vec3 texColor = (texturingEnabled == 0) ? vec3(1.0) : texture2D(diffuseTex, tCoord).rgb;
    gl_FragColor = vec4(texColor * diffuseCoeff * costheta + ambient, 1.0);
}