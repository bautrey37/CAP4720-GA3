precision mediump float;
uniform vec3 lightPosition;
uniform vec3 ambient;
uniform vec3 diffuseCoeff;
uniform vec3 viewVec;
uniform vec3 eyePosition;
uniform sampler2D diffuseTex;
uniform int texturingEnabled;
uniform int shadowDraw;
uniform int drawEnv;
uniform samplerCube texUnit;
varying vec2 tCoord;
varying vec3 fragPosition, fragNormal;
void main() {
	if (drawEnv == 1) {
		vec3 fragViewDir = normalize(eyePosition - fragPosition);
		vec3 normal = normalize(fragNormal);
		vec3 reflectedViewDir = reflect(fragViewDir, normal);
		vec3 envColor = textureCube(texUnit, reflectedViewDir).rgb;
		gl_FragColor = vec4(envColor, 1);
	}
	else {
		vec3 lightDir = normalize(lightPosition - fragPosition);
		float costheta = max(dot(lightDir, normalize(fragNormal)), 0.0); //light weighting
		vec3 texColor = (texturingEnabled == 0) ? vec3(1.0) : texture2D(diffuseTex, tCoord).rgb;
		gl_FragColor = (shadowDraw == 0) ? vec4(texColor * diffuseCoeff * costheta + texColor*ambient, 1.0)
											: vec4(0.1,0.1,0.1,0.9);
	}
}