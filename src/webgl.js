class GLP {
	constructor(gl, p) {
		this.gl = gl;
		this.program = p;
		this.vars = {};
	}
	attr(name, ...args) {
		const a = this.vars[name] || this.gl.getAttribLocation(this.program, name);
		this.gl[`vertexAttrib${args.length}f`](a, ...args);
		return this.vars[name] = a;
	}
	unif(name, ...args) {
		const u = this.vars[name] || this.gl.getUniformLocation(this.program, name);
		this.gl[`uniform${args.length}f`](u, ...args);
		return this.vars[name] = u;
	}
	buff(name, data, size, type = this.gl.FLOAT) {
		return webgl.buffer(this.gl, data, this.program, name, size, type);
	}
	clear() {
		// this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color (black)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
}

const webgl = {
	GLP,
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
	init: async function init(selector, vUrl, fUrl) {
		const gl = this.getRenderingContext(selector);
		// Do aliases?
		// const aliases = {attachShader: 'aS'};
		// for (const k in aliases) {
		// 	gl[aliases[k]] = gl[k];
		// }

		const program = await this.loadShaders([vUrl, fUrl]).then((s) => this.compile(gl, s));
		return new GLP(gl, program);
	}
};

export default webgl;
