# Procedural Parallax Starfields in WebGL

Try it out now: https://rocket-boots.github.io/webgl-starfield/example/

## Goals

* provide infinite procedural stars that can move with a "viewer position" in 2-dimensions
* be lightweight (w/r/t code size) so it can be used for js13k
* have relatively realistic-looking space visuals (aside from the unrelastic parallax w/ stars)
* use webGL for rendering

## Contains...

### Three fragment shaders

* 3D kaliset fractal from https://www.shadertoy.com/view/XlfGRj (not active in the example)
* Art-of-Code starfield (refactored) from https://www.youtube.com/watch?v=rvDo9LvfoVE
* Pixel-sized star/dust field inspired by https://www.shadertoy.com/view/MslGWN

### JS

* `example/starfield-test.js` - kicks off the example
* `src/stars.js` - functionality that bolts together the webglp code with the shaders
* [`webglp.js` - the only dependency](https://github.com/rocket-boots/webglp) - a small library for simplifying webGL setup and rendering

## Development

* `npm run build` will build a `stars-window.js` in the `dist` folder.

### Further Development

There is plenty of room for improvement to meet the goals:

- [x] Pull webglp code into its own repo
- [ ] Zoomable star dust
- [ ] Avoid patterns in AoC stafield when zoomed out
- [ ] 3 dimensional movement
- [ ] Star streaks/blurs when moving fast
- [ ] Develop a fix for star flickers in kaliset or art-of-code shader
- [ ] Blend kaliset and art-of-code shaders
- [ ] Add nebula clouds (e.g., https://wwwtyro.net/2016/10/22/2D-space-scene-procgen.html)
- [ ] Add galaxy star clusters (and remove galaxy.js?)
- [ ] Consider using 3d vertices instead of just fragment shaders?
- [ ] Allow stars to be defined by data, to allow incorporation into things like [galGen](https://github.com/Lukenickerson/galGen) and http://stars.chromeexperiments.com/
- [ ] Minify
- [ ] Documentation
