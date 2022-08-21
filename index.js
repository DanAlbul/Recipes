import { getRandomMeal } from './modules/mealData.js';
import { fetchFavMeals } from './modules/favMeals.js';
import { searchMealsHandler } from './modules/searchMeals.js';

function main() {
	const searchBtn = document.getElementById('search');
	const mealPopup = document.getElementById('meal-info-popup');
	const popupCloseBtn = document.getElementById('close-popup');

	popupCloseBtn.addEventListener('click', () => {
		mealPopup.classList.add('hidden');
	});
	searchBtn.addEventListener('click', searchMealsHandler);

	// Initializing app view with random meal, fav meals and main meal block
	getRandomMeal();
	fetchFavMeals(true);
}

main();
