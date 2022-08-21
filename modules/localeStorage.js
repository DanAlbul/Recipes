export function addMealLS(mealId) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = meal_ids === null ? [] : meal_ids;
	if (localStorage.getItem('mealId') === null) {
		localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
	}
}

export function addSearchResLS(mealId) {
	//const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = search_results === null ? [] : search_results;
	if (localStorage.getItem('mealId') === null) {
		localStorage.setItem('searchRes', JSON.stringify([...mealIds, mealId]));
	}
}

export function removeMealLS(mealId) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = meal_ids === null ? [] : meal_ids;
	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

export function getMealsLS() {
	const mealIds = JSON.parse(localStorage.getItem('mealIds'));
	return mealIds === null ? [] : mealIds;
}
