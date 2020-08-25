import webgl from './webgl.js';

// An attribute is variable and can contain a float or a vector (vec2, vec3, vec4). Your program should not exceed 16 attributes to work on all devices.
// A uniform is constant can contain an int, a float, a vector or a matrix (mat2, mat3, mat4). Your program should not exceed 128 vertex uniforms and 64 fragment uniforms.

let x = 0., y = 0., z = 0.;
let t = 0.;

const screenTriangleVerts = new Float32Array([
	-1, -1, // first triangle
	1, -1,
	-1, 1,
	-1, 1, // second triangle
	1, -1,
	1, 1,
]);
const numbersPerVertex = 2;
const verticesToDraw = screenTriangleVerts.length / numbersPerVertex;

async function init() {
	this.glp = await webgl.init('#canvas', './shaders/vshader.glsl', './shaders/fshader.glsl', true);
	this.draw();
}

function move(dx = 0, dy = 0, dz = 0) {
	x += dx;
	y += dy;
	z += dz;
	return this;
}

function inc(dt = 0) {
	t += dt;
	return this;
}

function draw() {
	const {glp} = this;
	const {gl} = glp;

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// Select the position attribute and set its X/Y/Z values
	glp.unif('viewerPosition', x, y, z, 1);
	// console.log(x, y);

	// Select the size attribute and set its value
	// glp.attr('size', 12);

	glp.unif('iTime', t);

	// Select the color uniform and set its value
	// glp.unif('color', 0, 1, 0, 1);

	glp.unif('iResolution', gl.canvas.width, gl.canvas.height);
	glp.unif('iMouse', -10, 100);

	// const verts = new Float32Array([
	// 	0, 0.5, 0, // point 1
	// 	-0.5, -0.5, 0, // point 2
	// 	0.5, -0.5, 0  // point 3
	// ]);
	// glp.buff('points', verts, 3);

	glp.buff('position', screenTriangleVerts, numbersPerVertex);

	glp.clear();
	// Draw points
	// gl.drawArrays(
	// 	gl.POINTS, // mode
	// 	0,         // starting point
	// 	1          // number of points to draw
	// );
	gl.drawArrays(gl.TRIANGLES, 0, verticesToDraw);
	return this;
}

export default { webgl, glp: null, init, move, inc, draw };
