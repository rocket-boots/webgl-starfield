// https://js1k.com/2015-hypetrain/details/2231
function galaxy(selector) {
	const g = document.querySelector(selector).getContext('webgl', {antialias: false}); 
	var shaderProgram;
	var shader;
	var time=0.0;
	var U_TIME = "t";
	var U_RESOLUTION = "r";
	var fragShaderCode = "precision mediump float;varying vec4 color;" +
	"void main(){float d = distance(gl_PointCoord,vec2(.5));if (d>.5) discard;gl_FragColor = color;}";

	var NUM_PARTICLES=10000;

	var vertShaderCode = `attribute vec2 p;
	uniform vec2 r;
	uniform float t;
	varying vec4 color;
	float H( float n ){
		return fract( (1.0 + cos(n)) * 415.92653) - .5;
	}
	void main(){
		float aspect=r.x/r.y;
		float n=pow(p.x/10000.,1.06);float n1=10.*n;
		float arms=2.;
		float twopi=6.28;
		mat3 m = mat3(.9,.25,0.4,
				-.5,.4*aspect,.7,
				0.,-.9,.5);
		mat4 c = mat4(1.,0.,0.,0.,
				0.,1.,0.,0.,
				0.,0.,1.,.5,
				0.,0.,0.,1.);
		float varx = H(n*59.);
		float vary = H(n*61.);
		float varz = H(n*67.);
		float fac = .5*smoothstep(-.0,1.8,(1.-n))+.3;
		gl_Position=c*vec4(m*
			vec3(
				sin(n1+t+twopi/arms*mod(p.x,arms))*n + varx * fac,
				cos(n1+t+twopi/arms*mod(p.x,arms))*n + vary * fac,
				varz * fac)
				,1.);
		gl_PointSize=100.*(varz); 
		color=vec4(.1/pow(n,2.2),.1/pow(n,2.),.45/pow(n,.4),.4/gl_PointSize);
	}`;

	let f, i, a = {width: 640, height: 480}, anim;
	for(shaderProgram = g.createProgram(),f=2;f--;g.compileShader(shader),g.attachShader(shaderProgram, shader)){
		shader = g.createShader(g.FRAGMENT_SHADER+f);
		g.shaderSource(shader,f?vertShaderCode:fragShaderCode);
	}

	var array = new Float32Array(NUM_PARTICLES*2);
	for (i=0;i<NUM_PARTICLES*2;i+=2) {
		array[i]=i/2;
		array[i+1]=0;
	}

	g.vertexAttribPointer(
		g.enableVertexAttribArray(
			g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer())
		),
		2,
		g.FLOAT,
		g.bufferData(g.ARRAY_BUFFER,array,g.STATIC_DRAW), 
		g.linkProgram(shaderProgram),
		g.useProgram(shaderProgram)
	);

	g.uniform2f(g.getUniformLocation(shaderProgram,U_RESOLUTION),a.width,a.height);

	g.blendFunc(g.SRC_ALPHA, g.ONE);
	g.enable(g.BLEND);
	//g.disable(g.DEPTH_TEST);

	//g.clearColor(0,0,0,1);

	(anim = function () {
		time+=.002;
		g.clear(g.COLOR_BUFFER_BIT);
		g.drawArrays(g.POINTS,g.uniform1f(g.getUniformLocation(shaderProgram,U_TIME),time),NUM_PARTICLES);
		requestAnimationFrame(anim);
	})();
}

export default galaxy;
