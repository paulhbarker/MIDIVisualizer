#version 330

in INTERFACE {
	float isMinor;
	vec2 uv;
	vec2 noteSize;
} In;

uniform float noteRadius;
uniform vec3 baseColor;
uniform vec3 minorColor;
uniform vec2 inverseScreenSize;

#define bottomLimit 0.25

out vec4 fragColor;

float udRoundBox(vec2 p, vec2 b, float r) {
    return length(max(abs(p)-b+r, 0.0))-r;
}

vec2 getFragCoord () {
	return (In.uv.xy / In.noteSize.xy + 0.5) * In.noteSize.xy;
}

void main(){
	// If lower area of the screen, discard fragment as it should be hidden behind the keyboard.
	if(gl_FragCoord.y < bottomLimit/inverseScreenSize.y){
		discard;
	}

	vec2 aspectRatio = vec2(inverseScreenSize.y/inverseScreenSize.x, 1.0);

	vec2 iResolution = In.noteSize.xy;
    vec2 fragCoord = getFragCoord() * aspectRatio;

    // setup
    float r = min(iResolution.x * aspectRatio.x, iResolution.y) * (0.01 + noteRadius);
    vec2 halfRes = 0.5 * iResolution.xy * aspectRatio;

    // compute box
    float b = udRoundBox( fragCoord.xy - halfRes, halfRes, r );
    
    // colorize
	vec3 base = mix(baseColor, minorColor, In.isMinor);
	vec4 rounding = mix(vec4(base, 1.0), vec4(0.0), step(0.0, b));
        
    fragColor = vec4(rounding);

}
