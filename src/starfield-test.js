import stars from './stars.js';
import galaxy from './galaxy.js';

(async () => {
	await stars.init();
	stars.move(1000, 1000); // needed to hide the star/dust alignment
	let t = 0;
	const loop = () => {
		window.requestAnimationFrame((now) => {
			const dt = (now - t) / 1000;
			t = now;
			// stars.move(0.01, 0.00002).inc(dt).draw(now);
			stars.move(100, 0.1).inc(dt).draw(now);
			// stars.inc(dt).draw(now);
			loop();
		});
	};
	loop();
})();

// galaxy('#gal');
