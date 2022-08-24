let pressed = false;
let innStartX;
let innNextX;
let initOffset;

const slider = document.getElementById('slider');
const innerSlider = document.getElementById('fav-meals');

export function onSwipeStartHandler(e) {
	if (e.type == 'touchstart') {
		innStartX = e.touches[0].clientX - innerSlider.offsetLeft;
	} else {
		pressed = true;
		initOffset = e.clientX;
		innStartX = e.clientX - innerSlider.offsetLeft;
	}
}

export function onSwipeMoveHandler(e) {
	//e.stopPropagation();
	e.preventDefault();
	if (e.type == 'touchmove') {
		innNextX = e.touches[0].clientX;
	} else {
		if (!pressed) return;
		innNextX = e.clientX;
	}
	innerSlider.style.left = `${innNextX - innStartX}px`;
	sliderCheckBoundary(e);
}

export function onSwipeEndHandler() {
	pressed = false;
}

export function sliderCheckBoundary(e) {
	let outer = slider.getBoundingClientRect();
	let inner = innerSlider.getBoundingClientRect();

	if (parseInt(innerSlider.style.left) > 0) {
		innerSlider.style.left = '0px';
	} else if (inner.left < outer.width * -1 + (e.type == 'touchmove' ? 400 : initOffset)) {
		console.log('here');
		innerSlider.style.left = `-${Math.floor(outer.width - 400)}px`;
	}
}
