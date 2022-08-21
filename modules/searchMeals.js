import { addMeal, getMealsBySearch } from './mealData.js';
import { show } from './dialogWindow.js';

const searchInput = document.getElementById('search-bar');
searchInput.placeholder = 'ingredient';

export async function searchMealsHandler() {
	const search_value = searchInput.value;
	const meals_not_null = await getMealsBySearch(search_value);
	const search_val_not_null = !!search_value;

	if (!meals_not_null) show(`There is no such ingredient as ${search_value}`);
	if (meals_not_null && search_val_not_null) {
		meals.innerHTML = '';

		meals_not_null.forEach((meal) => {
			//addSearchResLS(meal.idMeal);
			addMeal(meal);
		});
	}
}
