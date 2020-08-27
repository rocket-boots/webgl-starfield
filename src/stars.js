import webglp from './webglp.js';

let x = 0., y = 0., z = 0.;
let t = 0.;

const SHADERS = [
	['./shaders/vshader.glsl', './shaders/starnest-fshader.glsl'],
	['./shaders/vshader.glsl', './shaders/stars-fshader.glsl']
];

async function init() {
	this.glp = await webglp.init('#canvas', SHADERS);
	webglp.setViewport(this.glp.gl);
	// this.glp2 = await webglp.init(this.glp.gl, , true);
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

	const uniforms = [
		['viewerPosition', x, y, z, 1],
		['iTime', t],
		['iResolution', gl.canvas.width, gl.canvas.height],
		['iMouse', -10, 100]
	];

	// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	glp.draw({ uniforms, i: 0 })
		.draw({ uniforms, i: 1, clear: false });
	

	// gl.enable(gl.CULL_FACE);
	// gl.enable(gl.DEPTH_TEST);
	
	// Select the position attribute and set its X/Y/Z values
	// glp.unif('viewerPosition', x, y, z, 1);
	// console.log(x, y);

	// Select the size attribute and set its value
	// glp.attr('size', 12);

	// glp.unif('iTime', t);

	// Select the color uniform and set its value
	// glp.unif('color', 0, 1, 0, 1);

	// glp.unif('iResolution', gl.canvas.width, gl.canvas.height);
	// glp.unif('iMouse', -10, 100);

	// gl.useProgram(glp.p);
	// glp.ua(...uniforms);
	// glp.buff('position', webglp.SCREEN_TRIANGLE_VERTS, numbersPerVertex);
	// glp.clear();
	// gl.drawArrays(gl.TRIANGLES, 0, verticesToDraw);

	// gl.useProgram(glp2.p);
	// glp2.ua(...uniforms);
	// glp2.buff('position', screenTriangleVerts, numbersPerVertex);
	// // // glp2.clear();
	// gl.drawArrays(gl.TRIANGLES, 0, verticesToDraw);
	return this;
}

export default { webglp, init, move, inc, draw };
