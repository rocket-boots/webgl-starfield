# Procedural Parallax Starfields in WebGL

Try it out: https://rocket-boots.github.io/webgl-starfield/

## Contains...

### Three fragment shaders

* 3D kaliset fractal from https://www.shadertoy.com/view/XlfGRj
* Art-of-Code starfield (refactored) from https://www.youtube.com/watch?v=rvDo9LvfoVE
* Pixel-sized star/dust field inspired by https://www.shadertoy.com/view/MslGWN

### JS

* `starfield-test.js` - kicks off the example
* `stars.js` - functionality that bolts together the webglp code with the shaders
* `webglp.js` - a small library for simplifying webGL setup and rendering

## Further development

- [ ] Pull webglp code into its own repo
- [ ] Develop a fix for star flickers in kaliset or art-of-code shader
- [ ] Blend kaliset and art-of-code shaders
- [ ] Add nebula clouds (e.g., https://wwwtyro.net/2016/10/22/2D-space-scene-procgen.html)
- [ ] Add galaxy star clusters (and remove galaxy.js)
- [ ] Allo stars to be defined by data, to allow incorporation into things like [galGen](https://github.com/Lukenickerson/galGen) and http://stars.chromeexperiments.com/
- [ ] Minify
