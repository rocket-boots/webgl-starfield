import webglp from './webglp.js';

const MIN_ZOOM = 0.1;

let x = 0., y = 0., z = 0.;
let t = 0.;
let _zoom = 1.;

const SHADERS = [
	// ['./shaders/vshader.glsl', './shaders/starnest-fshader.glsl'],
	['./shaders/vshader.glsl', './shaders/starfield-art-fshader.glsl'],
	['./shaders/vshader.glsl', './shaders/stars-fshader.glsl'],
];

async function init() {
	this.glp = await webglp.init('#canvas', SHADERS);
	webglp.fullscreen(this.glp.gl);
	// const {gl} = this.glp;
	// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	// gl.enable(gl.CULL_FACE);
	// gl.enable(gl.DEPTH_TEST);
}

function move(dx = 0, dy = 0, dz = 0) {
	x += dx;
	y += dy;
	z += dz;
	return this;
}

/** Increment time */
function inc(dt = 0) {
	t += dt;
	return this;
}

function zoom(dz) {
	_zoom = Math.max(MIN_ZOOM, _zoom + dz);
	return this;
}

/** Draw WebGL programs to the screen w/ appropriate params (uniforms) */
function draw() {
	const {glp} = this;
	const {gl} = glp;

	const uniforms = [
		['viewerPosition', x, y, z],
		['zoom', _zoom],
		['iTime', t],
		['iResolution', gl.canvas.width, gl.canvas.height],
		['iMouse', 0, 0]
	];
	// Example using longer formats:
	// glp.ua(...uniforms);
	// glp.unif('viewerPosition', x, y, z);
	// glp.unif('iTime', t);
	// glp.buff('position', webglp.SCREEN_TRIANGLE_VERTS, webglp.SCREEN_TRIANGLES_NUMBERS_PER_VERTEX);

	glp.drawAll(uniforms);
	// Example for drawing specific programs:
	// glp.draw({ uniforms, i: 0 })
	// 	.draw({ uniforms, i: 1, clear: false })
	// 	.draw({ uniforms, i: 2, clear: false });

	return this;
}

export default { webglp, init, move, inc, zoom, draw };
