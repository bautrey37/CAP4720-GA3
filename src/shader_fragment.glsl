precision mediump float;
uniform vec3 lightPosition;
uniform vec3 ambient;
uniform vec3 diffuseCoeff;
uniform vec3 viewVec;
uniform float shinyness;
uniform sampler2D diffuseTex, shadowMap;
uniform int texturingEnabled;
uniform int shadowDraw;
varying vec2 tCoord;
varying vec3 fragPosition, fragNormal;
void main() {
    vec3 lightDir = normalize(lightPosition - fragPosition);

    float specular = 0.0;
    float d = max(dot(fragNormal, lightDir), 0.0);
    if (d > 0.0) {
        vec3 reflectVec = reflect(-lightDir, fragNormal);
        //specular = pow(max(dot(reflectVec, viewVec), 0.0), 10.0);
    }
    float costheta = max(dot(lightDir, normalize(fragNormal)), 0.0); //light weighting
    vec3 texColor = (texturingEnabled == 0) ? vec3(1.0) : texture2D(diffuseTex, tCoord).rgb;
	gl_FragColor = (shadowDraw == 0) ? vec4(texColor * diffuseCoeff * costheta + texColor*ambient + specular, 1.0)
										: vec4(0.0,0.0,0.3,0.9);
}