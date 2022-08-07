import { show } from './dialog.js';

const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const favs = document.querySelectorAll('.fav');
let search_results;

const searchInput = document.getElementById('search-bar');
searchInput.placeholder = 'ingredient';
const searchBtn = document.getElementById('search');

function main() {
	getRandomMeal();
	fetchFavMeals(true);
}

async function getRandomMeal() {
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
	const respData = await resp.json();
	const randomMeal = respData.meals[0];
	addMeal(randomMeal, true);
}

async function getMealById(id) {
	const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
	//const respData = await resp.json();
	return resp.json();
	//const meal = respData.meals[0];
	//return meal;
}

async function getMealsBySearch(term) {
	const resp = await fetch(
		`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
	);
	const respData = await resp.json();
	const meals = respData.meals;
	return meals;
}

function addMeal(mealData, random = false) {
	const meal = document.createElement('div');
	meal.classList.add('meal');
	meal.id = mealData.idMeal;
	meal.innerHTML = `
      <div class="meal-header">
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

	meals.appendChild(meal);
}

async function fetchFavMeals(render = false) {
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

function createMealFavNode(mealData) {
	const fav_meal = document.createElement('li');
	fav_meal.classList.add('fav');
	fav_meal.id = mealData.idMeal;
	fav_meal.innerHTML = `
			<img
				draggable="false"
				src="${mealData.strMealThumb}/preview"
				alt="${mealData.strMeal}"
			/>
			<span title="${mealData.strMeal}">${mealData.strMeal}</span>
			<button class="unfav">
				<i class="fa-solid fa-heart-circle-minus"></i>
			</button>
`;

	const unfav_btn = fav_meal.querySelector('.unfav');
	unfav_btn.addEventListener('click', (e) => {
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

function removeMealFavEl(mealData) {
	removeMealLS(mealData.idMeal);
	const fav = document.getElementById(mealData.idMeal);
	favoriteContainer.removeChild(fav);
}

function addMealLS(mealId) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = meal_ids === null ? [] : meal_ids;
	if (localStorage.getItem('mealId') === null) {
		localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
	}
}

function addSearchResLS(mealId) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = search_results === null ? [] : search_results;
	if (localStorage.getItem('mealId') === null) {
		localStorage.setItem('searchRes', JSON.stringify([...mealIds, mealId]));
	}
}

function removeMealLS(mealId) {
	const meal_ids = JSON.parse(localStorage.getItem('mealIds'));
	const mealIds = meal_ids === null ? [] : meal_ids;
	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS() {
	const mealIds = JSON.parse(localStorage.getItem('mealIds'));
	return mealIds === null ? [] : mealIds;
}

function getMealIDs(nodes) {
	const ids = [];
	nodes.forEach((el) => {
		ids.push(el.idMeal);
	});

	return ids;
}

searchBtn.addEventListener('click', async () => {
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
});

main();
