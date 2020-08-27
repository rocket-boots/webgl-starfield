const SCREEN_TRIANGLE_VERTS = new Float32Array([
	-1, -1, // first triangle
	1, -1,
	-1, 1,
	-1, 1, // second triangle
	1, -1,
	1, 1,
]),
SCREEN_TRIANGLES_NUMBERS_PER_VERTEX = 2;

class GLP {
	constructor(gl, p) {
		Object.assign(this, {
			gl, // webgl rendering context object
			p, // array of programs
			i: 0, // current program
			// variables - internal storage of attributes and uniforms
			// in a per-program array
			aV: p.map(()=>({})),
			uV: p.map(()=>({})),
		});
		console.log(this);
	}
	use(i) {
		this.i = i;
		this.gl.useProgram(this.p[i]);
		return this;
	}
	// An attribute is variable and can contain a float or a vector (vec2, vec3, vec4).
	// Your program should not exceed 16 attributes to work on all devices.
	attr(name, ...args) {
		const a = this.aV[this.i][name] || this.gl.getAttribLocation(this.p[this.i], name);
		this.gl[`vertexAttrib${args.length}f`](a, ...args);
		return this.aV[this.i][name] = a;
	}
	// A uniform is constant can contain an int, a float, a vector or a matrix (mat2, mat3, mat4).
	// Your program should not exceed 128 vertex uniforms and 64 fragment uniforms.
	unif(name, ...args) {
		const u = this.uV[this.i][name] || this.gl.getUniformLocation(this.p[this.i], name);
		this.gl[`uniform${args.length}f`](u, ...args);
		return this.uV[this.i][name] = u;
	}
	// Set Uniforms from an array
	ua(...a) {
		a.forEach(u => this.unif(...u));
	}
	buff(name, data, size, type = this.gl.FLOAT) {
		return webglp.buffer(this.gl, data, this.p[this.i], name, size, type);
	}
	clear() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color (black)
		// this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas AND the depth buffer.
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
	draw({
		uniforms = [],
		i = this.i,
		buffName = 'position',
		verts = SCREEN_TRIANGLE_VERTS,
		numbersPerVertex = SCREEN_TRIANGLES_NUMBERS_PER_VERTEX,
		verticesToDraw,
		type = this.gl.TRIANGLES,
		clear = true,
	}) {
		const o = this;
		o.use(i);
		o.ua(...uniforms);
		o.buff(buffName, verts, numbersPerVertex);
		if (clear) { o.clear(); }
		if (verticesToDraw === undefined) {
			verticesToDraw = verts.length / numbersPerVertex;
		}
		o.gl.drawArrays(type, 0, verticesToDraw);
		return o;
	}
}

const webglp = {
	GLP,
	SCREEN_TRIANGLE_VERTS,
	SCREEN_TRIANGLES_NUMBERS_PER_VERTEX,
	getRenderingContext: (selector, antialias = false) => {
		const canvas = document.querySelector(selector);
		const gl = canvas.getContext('webgl', { antialias }); // Get the WebGL rendering context
		if (!gl) {
			alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		}
		return gl;
	},
	loadText: (url) => {
		return fetch(url).then(response => response.text());
	},
	loadShaders: function (urls) {
		return Promise.all(urls.map(u => this.loadText(u)));
	},
	compileShader: (gl, type, src) => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		return shader;
	},
	setViewport: (gl) => {
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	},
	// Based on https://xem.github.io/articles/webgl-guide.html
	// TODO: Remove
	// originalCompile: function (gl, vshader, fshader) {
	// 	const vs = this.compileShader(gl, gl.VERTEX_SHADER, vshader);
	// 	const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, fshader);
	
	// 	// Create the WebGL program and use it
	// 	const program = gl.createProgram();
	// 	gl.aS(program, vs);
	// 	gl.aS(program, fs);
	// 	gl.linkProgram(program);
	// 	gl.useProgram(program);
	
	// 	// Log compilation errors, if any
	// 	console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
	// 	console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
	// 	console.log('program:', gl.getProgramInfoLog(program) || 'OK');

	// 	return program;
	// },
	compile: function (gl, shaders) { // shaders = array of text
		// Create the WebGL program
		const program = gl.createProgram();

		const S = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER];
		const L = ['vertex', 'fragment'];
		shaders.map((t, i) => {
			const s = this.compileShader(gl, S[i], t);
			gl.attachShader(program, s);
			console.log(L[i] + ' shader:', gl.getShaderInfoLog(s) || 'OK');
		});

		gl.linkProgram(program);
		gl.useProgram(program);
	
		console.log('program:', gl.getProgramInfoLog(program) || 'OK');

		return program;
	},
	buffer: (gl, data, program, attr, size, type) => {
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		const pos = (typeof attr === 'string') ? gl.getAttribLocation(program, attr) : attr;
		gl.vertexAttribPointer(
			pos,	// position attribute location
			size,	// # of components per iteration
			type,	// what type is the data?
			false,	// don't normalize the data
			0,		// 0 = move forward size * sizeof(type) each iteration to get the next position
			0,		// start at beginning of the buffer
		);
		gl.enableVertexAttribArray(pos);
	},
	// Do it all - Create canvas rendering context, load shaders, compile, and return the context
	// First param can either be a selector or a GL object
	init: async function init(a, urlsArr) {
		const gl = (typeof a === 'string') ? this.getRenderingContext(a) : a;
		// Do aliases?
		// const aliases = {attachShader: 'aS'};
		// for (const k in aliases) {
		// 	gl[aliases[k]] = gl[k];
		// }
		const promises = urlsArr.map(urls => (
			this.loadShaders(urls).then((s) => this.compile(gl, s))
		));
		const programs = await Promise.all(promises);
		// const program = await this.loadShaders(urlsArr[0]).then((s) => this.compile(gl, s));
		// console.log(programs);
		return new GLP(gl, programs);
	}
};

export default webglp;
