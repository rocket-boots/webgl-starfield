import stars from './stars.js';
// import galaxy from './galaxy.js';

const ZOOM_MULTIPLIER = 0.0015;

(async () => {
	await stars.init();
	setupZoom();
	let t = 0;
	const loop = () => {
		window.requestAnimationFrame((now) => {
			const dt = (now - t) / 1000;
			t = now;
			stars.move(100, 0.1).inc(dt).draw(now);
			loop();
		});
	};
	loop();
})();

function setupZoom() {
	window.addEventListener('wheel', (event) => {
		stars.zoom(event.deltaY * ZOOM_MULTIPLIER);
	});
}

setupZoom();

// galaxy('#gal');
