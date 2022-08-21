export function showMealInfo(mealData) {
	const mealInfoEl = document.getElementById('meal-info');
	const mealPopup = document.getElementById('meal-info-popup');

	// clear container before open
	mealInfoEl.innerHTML = '';

	//get ingredients and measures
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		const ingredient = mealData['strIngredient' + i];
		const measure = mealData['strMeasure' + i];
		if (ingredient) {
			ingredients.push([`${ingredient}`, `${measure}`]);
		} else {
			break;
		}
	}

	// update the meal Info
	const mealEl = document.createElement('div');
	mealEl.innerHTML = `
		<h1>${mealData.strMeal}</h1>
		<img
			src="${mealData.strMealThumb}"
			alt="${mealData.strMeal}"
		/>
		<h3 class="meal-info-headers" >Instructions:</h3>
		<textarea readonly>${mealData.strInstructions}</textarea>
		<h3 class="meal-info-headers">Ingredients:</h3>
		<ul class="ingredients">
			${ingredients
				.map((el) => {
					return `<li id="${el[0]}">${el[0]}<span>${el[1]}</span></li>`;
				})
				.join('')}
		</ul>
	`;
	mealInfoEl.appendChild(mealEl);

	mealPopup.classList.remove('hidden');
}
