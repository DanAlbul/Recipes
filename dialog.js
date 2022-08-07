const container = document.getElementById('dialog-container');
const close_alert = document.getElementById('close-alert');
const mobile_container = document.querySelector('.mobile-container');

close_alert.onclick = close;

export function show(msg) {
	let content = document.getElementById('dialog-body');
	mobile_container.classList.add('blur');
	container.style.top = '30%';
	container.style.opacity = 1;
	content.textContent = msg;
}

export function close() {
	mobile_container.classList.remove('blur');
	container.style.top = '-30%';
	container.style.opacity = 0;
}
