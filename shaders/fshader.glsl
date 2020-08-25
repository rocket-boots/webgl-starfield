precision mediump float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform vec4 viewerPosition;
// attribute float size;

// varying vec4 v_color;

// uniform vec4 color;


#define iterations 12 // 17
#define formuparam 0.53 // 0.53 magic number

#define startVolume 0 // 0
#define volSteps 8 // 20
#define stepSize 0.1 // 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.0000005 // 0.010

#define brightness 0.0015 // 0.0015
#define darkmatter 0.300 // 0.300
#define distfading 0.730 // 0.730
#define saturation 0.750 // 0.850


// void main() {
// 	// Set fragment color: vec4(r, g, b, alpha)
// 	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

// 	// float d = distance(gl_PointCoord, vec2(0.5, 0.5));
// 	// if (d < .5) { gl_FragColor = v_color; }
// 	// else {
// 	// 	// gl_FragColor = vec4(1.0, 0.0, 0.0, 0.1);
// 	// 	discard;
// 	// }
// }

#define stardustDepths 1
#define stardustDepthSpeed 0.00001
#define stardustQuant 100. // Lower = more
#define stardustColorMult 1.

#define starDepths 3
#define starDepthSpeed 0.000001

// Simplicity Galaxy by CBS
// https://www.shadertoy.com/view/MslGWN
vec3 nrand3(vec2 n) {
	vec3 a = fract( cos( n.x*8.3e-3 + n.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( n.x*0.3e-3 + n.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

vec4 getStardustColor(in vec2 fragCoord, in float depthLevel, in float spd) {
    vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;
	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	// p += .2 * vec3(sin(iTime / 16.), sin(iTime / 12.),  sin(iTime / 128.));

	p += viewerPosition.xyz * (depthLevel * spd);
	p += depthLevel; // Adds to randomness (???)
	p.y += spd;

	vec2 seed = p.xy * 2.0;	
	seed = floor(seed * iResolution.x);
	vec3 rnd = nrand3( seed );
	vec4 starColor = vec4(pow(rnd.y, stardustQuant)) * vec4(1., .9, .9, 1.);
	return starColor;
}

void addStardust( out vec4 fragColor, in vec2 fragCoord ) {
	for (int s = 1; s <= stardustDepths; s++) {
		fragColor += getStardustColor(fragCoord, float(s), stardustDepthSpeed);
	}
}

void addStars( out vec4 fragColor, in vec2 fragCoord ) {
	for (int s = 1; s <= starDepths; s++) {
		fragColor += getStardustColor(fragCoord, float(s), starDepthSpeed);
	}
}

// Star Nest by Pablo Roman Andrioli
// This content is under the MIT License.
// https://www.shadertoy.com/view/XlfGRj
void starNest( out vec4 fragColor, in vec2 fragCoord )
{
	//get coords and direction
	vec2 uv=fragCoord.xy/iResolution.xy-.5;
	uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*zoom,1.);

	//mouse rotation
	float a1=.5+iMouse.x/iResolution.x*2.;
	float a2=.8+iMouse.y/iResolution.y*2.;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from = vec3(1.,.5,0.5);
	from += viewerPosition.xyz * speed;
	from.xz*=rot1;
	from.xy*=rot2;

	// float bPower = 11. + sin(viewerPosition.x * 1000.) * 10.;
	// vec3 huePower = vec3(1., 3., 2.);
	
	//volumetric rendering
	float s = 0.1, fade = 1.;
	vec3 v = vec3(0.);
	for (int r = startVolume; r < volSteps; r++) {
		vec3 p = from + s * dir * .5;
		p = abs(vec3(tile) - mod(p,vec3(tile*2.))); // tiling fold
		float pa, a = pa = 0.;
		for (int i=0; i<iterations; i++) { 
			p = abs(p)/dot(p,p)-formuparam; // the magic formula
			float len = length(p);
			a += abs(len - pa); // absolute sum of average change
			pa = len;
		}
		float dm = max(0.,darkmatter-a*a*.001); //dark matter
		a *= a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		// v+=vec3(dm,dm*.5,0.);
		v += fade;
		// v += vec3(pow(s, huePower.r), pow(s, huePower.g), pow(s, huePower.b)) * a*brightness*fade; // coloring based on distance
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		v = min(v, 100.);
		fade *= distfading; // distance fading
		s += stepSize;
	}
	v = mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.01, 1.);
}


void main() {
	vec2 fragXY = gl_FragCoord.xy;
	starNest(gl_FragColor, fragXY);
	gl_FragColor = min(gl_FragColor, .15);
	addStars(gl_FragColor, fragXY);
	addStardust(gl_FragColor, fragXY);
}
