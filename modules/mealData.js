import { addMealLS } from './localeStorage.js';
import { showMealInfo } from './mealInfo.js';
import { createMealFavNode, removeMealFavEl } from './favMeals.js';

const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

export function addMeal(mealData, random = false) {
	const meal = document.createElement('div');
	meal.classList.add('meal');
	meal.id = mealData.idMeal;
	meal.innerHTML = `
      <div id="meal-header" class="meal-header">
        ${random ? ` <span class="random">Random Recipe</span>` : ''}
        <img
          src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"
        />
      </div>
      <div class="meal-body">
        <h4 title="${mealData.strMeal}">${mealData.strMeal}</h4>
        <button class="fav-btn">
        	<i class="fas fa-heart"></i>
      	</button>
    </div>`;

	const fav_btn = meal.querySelector('.meal-body .fav-btn');
	fav_btn.addEventListener('click', (e) => {
		if (fav_btn.classList.contains('active')) {
			e.target.classList.remove('active');
			fav_btn.classList.remove('active');
			removeMealFavEl(mealData);
		} else {
			addMealLS(mealData.idMeal);
			e.target.classList.add('active');
			fav_btn.classList.add('active');
			const node = createMealFavNode(mealData);
			favoriteContainer.prepend(node);
		}
	});

	const mealHeaderEl = meal.querySelector('#meal-header');
	mealHeaderEl.addEventListener('click', () => {
		showMealInfo(mealData);
	});

	meals.appendChild(meal);
}

export async function getRandomMeal() {
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
	const respData = await resp.json();
	const randomMeal = respData.meals[0];
	addMeal(randomMeal, true);
}

export async function getMealById(id) {
	const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
	return resp.json();
}

export async function getMealsBySearch(term) {
	const resp = await fetch(
		`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
	);
	const respData = await resp.json();
	const meals = respData.meals;
	return meals;
}
