import { getMealById } from './mealData.js';
import { showMealInfo } from './mealInfo.js';
import { removeMealLS } from './localeStorage.js';

const favoriteContainer = document.getElementById('fav-meals');

export async function fetchFavMeals(render = false) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	/* 
	  Fastets method to get favorite meals from LS 
		and append them to favorite meals container 
		without idling too much time 
	*/
	let mealsArr = [];
	const mealIds = meal_ids === null ? [] : meal_ids;
	const repeats = mealIds.length === 1 ? 1 : mealIds.length - 1;
	for (let i = repeats; i >= 0; i--) {
		const mealId = mealIds[i];
		const meal = getMealById(mealId);
		if (render) {
			meal.then((res) => {
				const fav_node = createMealFavNode(res.meals[0]);
				favoriteContainer.prepend(fav_node);
			});
		} else {
			/* 
				If render is not a purpose - 
				return promise with array of favorite meals 
			*/
			meal.then((res) => {
				mealsArr.push(res.meals[0]);
			});
		}
	}

	if (!render) return (mealsArr = mealsArr === null ? [] : mealsArr);
}

export function createMealFavNode(mealData) {
	const fav_meal = document.createElement('li');
	fav_meal.classList.add('fav');
	fav_meal.id = mealData.idMeal;
	fav_meal.innerHTML = `
			<img id="fav-img"
				draggable="false"
				src="${mealData.strMealThumb}/preview"
				alt="${mealData.strMeal}"
			/>
			<span title="${mealData.strMeal}">${mealData.strMeal}</span>
			<button class="unfav">
				<i class="fa-solid fa-heart-circle-minus"></i>
			</button>
`;

	/* 	const favMeaEl = fav_meal.querySelector('#fav-img');
	favMeaEl.addEventListener('click', () => {
		showMealInfo(mealData);
	});
 */

	fav_meal.addEventListener('click', (e) => {
		showMealInfo(mealData);
	});

	const unfav_btn = fav_meal.querySelector('.unfav');
	unfav_btn.addEventListener('click', (e) => {
		e.stopPropagation();
		const unfav = e.target.closest('li');
		const unfav_id = unfav.id;
		const meals = JSON.parse(localStorage.getItem('mealIds'));
		localStorage.setItem(
			'mealIds',
			JSON.stringify(meals.filter((el) => el !== unfav_id))
		);
		favoriteContainer.removeChild(unfav);
	});
	return fav_meal;
}

export function removeMealFavEl(mealData) {
	removeMealLS(mealData.idMeal);
	const fav = document.getElementById(mealData.idMeal);
	favoriteContainer.removeChild(fav);
}
