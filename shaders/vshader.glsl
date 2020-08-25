// uniform vec2 resolution;
// uniform vec2 iMouse;
// uniform float time;

attribute vec4 position;
// attribute float size;

varying vec4 v_color;

void main() {

// 	// Set vertex position: vec4(X, Y, Z, 1.0)
	gl_Position = position; // vec4(0.0, 0.0, 0.0, 1.0);

// 	// Point size in pixels: float
	// gl_PointSize = size + ((size/2.) * sin(time)); // 10.0;
// }



}
