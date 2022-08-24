import { getRandomMeal } from './modules/mealData.js';
import { fetchFavMeals } from './modules/favMeals.js';
import { searchMealsHandler } from './modules/searchMeals.js';
import {
	onSwipeMoveHandler,
	onSwipeStartHandler,
	onSwipeEndHandler
} from './modules/favSlider.js	';

function main() {
	const searchBtn = document.getElementById('search');
	const mealPopup = document.getElementById('meal-info-popup');
	const popupCloseBtn = document.getElementById('close-popup');
	const slider = document.getElementById('slider');

	popupCloseBtn.addEventListener('click', () => {
		mealPopup.classList.add('hidden');
	});
	searchBtn.addEventListener('click', searchMealsHandler);

	// on touch devices
	slider.addEventListener('touchstart', onSwipeStartHandler);
	slider.addEventListener('touchmove', onSwipeMoveHandler);

	// on PCs
	slider.addEventListener('mousedown', onSwipeStartHandler);
	window.addEventListener('mouseup', onSwipeEndHandler);
	slider.addEventListener('mousemove', onSwipeMoveHandler);

	// Initializing app view with random meal, fav meals and main meal block
	getRandomMeal();
	fetchFavMeals(true);
}

main();
