(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/webgl.js
class GLP {
	constructor(gl, p) {
		this.gl = gl;
		this.program = p;
	}
	attr(name, ...args) {
		const a = this.gl.getAttribLocation(this.program, name);
		this.gl[`vertexAttrib${args.length}f`](a, ...args);
		return a;
	}
	unif(name, ...args) {
		const u = this.gl.getUniformLocation(this.program, name);
		this.gl[`uniform${args.length}f`](u, ...args);
		return u;
	}
	buffer(data, attribute, size, type) {
		return webgl.buffer(this.gl, data, this.program, attribute, size, type);
	}
}

const webgl = {
	GLP,
	getRenderingContext: (selector) => {
		const canvas = document.querySelector(selector);
		const gl = canvas.getContext('webgl'); // Get the WebGL rendering context
		if (gl === null) {
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
	buffer: (gl, data, program, attribute, size, type) => {
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		const a = gl.getAttribLocation(program, attribute);
		gl.vertexAttribPointer(a, size, type, false, 0, 0);
		gl.enableVertexAttribArray(a);
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

/* harmony default export */ var src_webgl = (webgl);

// CONCATENATED MODULE: ./src/stars.js


// An attribute is variable and can contain a float or a vector (vec2, vec3, vec4). Your program should not exceed 16 attributes to work on all devices.
// A uniform is constant can contain an int, a float, a vector or a matrix (mat2, mat3, mat4). Your program should not exceed 128 vertex uniforms and 64 fragment uniforms.

async function init() {
	const glp = await src_webgl.init('#canvas', './shaders/vshader.glsl', './shaders/fshader.glsl');
	this.gl = glp.gl;
	this.program = glp.program;
	this.glp = glp;

	this.setVars();

	this.draw();
}

let x = 0;

function setVars(xAdd = 0) {
	x += xAdd;
	console.log(x);
	// Select the position attribute and set its X/Y/Z values
	this.glp.attr('position', x, 0, 0, 1);

	// Select the size attribute and set its value
	this.glp.attr('size', 12);

	// Select the color uniform and set its value
	this.glp.unif('color', 0, 1, 0, 1);

	this.draw();
	return this;
}

function draw() {
	const gl = this.gl;
	// gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color (black)
	gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

	// Draw points
	gl.drawArrays(
		gl.POINTS, // mode
		0,         // starting point
		1          // number of points to draw
	);
}

/* harmony default export */ var stars = ({ glp: null, gl: null, program: null, init, setVars, draw });

// CONCATENATED MODULE: ./index.mjs


/* harmony default export */ var index = __webpack_exports__["default"] = (stars);


/***/ })
/******/ ])["default"]));