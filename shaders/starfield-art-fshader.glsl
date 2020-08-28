precision mediump float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform vec3 viewerPosition;
uniform float zoom; // #define ZOOM 1.

#define SEED1 123.34
#define SEED2 456.2
#define SEED3 45.32
#define SEED4 34.
#define SEED5 345.32
#define SEED6 1603.8
#define SEED7 2345.2

#define PI 3.1415
#define TWO_PI 6.2831


#define LIGHT_EFFECT 0.015
#define HOT_COLOR_MULT 1.2
#define COLOR_MULT 13.2 // higher -> more colorful
#define NUM_LAYERS 5.
#define DIAGNOL_FLARE_MULT .3 // how much dimmer are diagnol flares?
#define FLARE_OPACITY .5
#define VIEWER_MOVE_SCALE .000005
#define SIZE_SCALE 1.
#define FLICKER_TIMING 1.
#define SHIFT_OFFSET 453.2

// https://www.youtube.com/watch?v=rvDo9LvfoVE

// Generic rotation function
mat2 Rot(float a) {
	float s = sin(a), c = cos(a);
	return mat2(c, -s, s, c);
}

float Rays(vec2 uv) {
	return max(0., .5 - abs(uv.x * uv.y * 1000.));
}

float Star(vec2 uv, float flare) {
	float d = length(uv); // distance to center of "screen"
	float m = LIGHT_EFFECT/d;  // Light effect
	m += Rays(uv) * flare; // Add cardinal rays
	uv *= Rot(PI/4.); // Rotate 45 degrees
	m += Rays(uv) * flare * DIAGNOL_FLARE_MULT; // Add diagnol rays (less flare)
	// Need to cut off the glow because the stars will be in boxes,
	// only taking into consideration their direct neighbors' boxes,
	// so the cutoff will be 1 d, and will start at 0.2 d
	m *= smoothstep(.4, .2, d);
	return m;
}

// Pseudo-random number generator - between 0 and 1
// Requires three "random" seeds
float Hash21(vec2 p, float s1, float s2, float s3) {
	p = fract(p * vec2(s1, s2));
	p += dot(p, p + s3);
	return fract(p.x * p.y);	
}

vec3 HotColor(float size, float rand) {
	float hotnessRand = fract(rand * SEED6);
	float colorRand = fract(rand * SEED7);
	float hotness = hotnessRand * .5 + size * .5;
	
	// Stars are colored by hotness
	// 0 -> .2  ->  .4  ->  .6  -> .8 -> 1
	//   Red  Orange  Yellow  White  Blue
	vec3 color;
	if (hotness < .6) { // Base of red, increase greenness with hotness to make orange and yellow
		color = vec3(1., hotness/.6 , hotness*.9);
	} else { // Base of white, decrease red and green with hotness to make blue
		float rg = 1. - (hotness - .6)/.4;
		color = vec3(rg,rg,1.);
	}
	// Make more white
	color = clamp(color * HOT_COLOR_MULT, 0., 1.);

	// Multiplying and adding by .5 mean you're varying from .5 -> 1 rather than 0 -> 1
	// color = sin(color * colorRand * COLOR_MULT) * .5 + .5;
	// vec3 blend = clamp(color + .3, 0., 1.);
	// color *= blend;
	// color *= vec3(1., .9, 1. + size); // reduce the green, make bigger stars bluer

	// https://www.livescience.com/34469-purple-stars-green-stars-star-colors.html
	// "A green star is radiating right in the center of the visible light spectrum,
	// which means it is emitting some light in all the possible colors. The star
	// would therefore appear white — a combination of all colors."
	// if (color.g > color.r && color.g > color.b) {
	// 	color.b = color.g;
	// 	color.r = color.g;
	// 	color.g = 0.;
	// }
	// "Purple stars are something the human eye won't easily see because our eyes
	// are more sensitive to blue light. Since a star emitting purple light also sends
	// out blue light — the two colors are next to one another on the visible light
	// spectrum — the human eye primarily picks up the blue light."
	// float purpleness = abs(color.r - color.b);
	// if (purpleness < .1) {
	// 	color.r = max(0., color.r - .5);
	// }
	
	return color;
}

vec3 StarLayer(vec2 uv) {
	vec3 col = vec3(0);

	// Breaks the screen into fractional boxes
	vec2 boxFract = fract(uv); // keep fractional component to break into multiple squares
	vec2 gv = boxFract - .5; // box origin
	vec2 id = floor(uv); // keep integer component for a unique ID to identify each box

	// Loop over neighboring boxes (3x3)
	for(int y=-1;y<=1;y++) {
		for(int x=-1;x<=1;x++) {
			vec2 boxOffset = vec2(x, y); // which box? 0,0 is the current box
			
			// One random number can be used to cheaply get other random numbers by getting
			// the fractional components after multiplying by some big numbers.
			float boxRand = Hash21(id + boxOffset, SEED1, SEED2, SEED3);
			float boxRand2 = fract(boxRand * SEED4);
			float size = fract(boxRand * SEED5);

			vec2 randOffset = vec2(boxRand, boxRand2) - .5;
			float flare = smoothstep(.85, 1., size) * FLARE_OPACITY; // returns zero if lower than .9 size
			vec2 starCoord = gv - boxOffset - randOffset;

			float star = Star(starCoord, flare);
			vec3 color = HotColor(size, boxRand);
			
			// Twinkle
			// star *= sin(iTime * FLICKER_TIMING + boxRand * TWO_PI) * .2 + .8;

			col += star * size * SIZE_SCALE * color;
		}
	}
	// Put outline on boxes
	// if (gv.x > .48 || gv.y > .48) col.r = 1.;
	return col;
}

void main() {
	vec2 fragCoord = gl_FragCoord.xy;
	// The full screen coordinates
	vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	uv *= zoom;
	float t = iTime * .1;

	// Rotate over time
	// uv *= Rot(t * .01);
	vec2 viewerMovement = viewerPosition.xy * VIEWER_MOVE_SCALE;

	vec3 col = vec3(0);
	
	for(float i=0.; i<1.; i +=1./NUM_LAYERS) {
		// Depth based on time for flying through space
		// float depth = fract(i + t); // 0 --> 1 over time
		
		// Depth just based on layer
		float depth = 2. * i;
		float zScale = mix(20., .2, depth);
		float shift = i * SHIFT_OFFSET; // helps to make it so stars aren't aligned
		float fade = depth * smoothstep(1., .95, depth); // fade in and fade out with depth movement
		col += StarLayer(uv * zScale + shift + viewerMovement) * fade;
	}

	float brightness = (col.x + col.y + col.z) / 3.;
	gl_FragColor = vec4(col, brightness);

	// if (brightness < .1) {
	// 	discard;
	// }

	// float oldValue = texelFetch(oldImage, int2(gl_FragCoord.xy), 0).rgb;
    // gl_FragColor.rgb = lerp(oldValue - vec3(0.004), gl_FragColor.rgb, 0.5);
    // gl_FragColor.a = 1.0;
}
