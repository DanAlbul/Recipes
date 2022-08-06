const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const favs = document.querySelectorAll('.fav');
const meal_ids = JSON.parse(localStorage.getItem('mealIds'));

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
	const meals = await fetch(
		`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
	);
}

function addMeal(mealData, random = false) {
	const meal = document.createElement('div');
	meal.classList.add('meal');
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
			removeMealLS(mealData.idMeal);
			e.target.classList.remove('active');
			fav_btn.classList.remove('active');
			removeMealFavEl(mealData);
		} else {
			addMealLS(mealData.idMeal);
			e.target.classList.add('active');
			fav_btn.classList.add('active');
			const template = document.createElement('template');
			template.innerHTML = createMealFavNode(mealData);
			const node = template.content.firstElementChild;
			favoriteContainer.prepend(node);
		}
	});

	meals.appendChild(meal);
}

function addMealLS(mealId) {
	const mealIds = meal_ids === null ? [] : meal_ids;
	if (localStorage.getItem('mealId') === null) {
		localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
	}
}

function removeMealLS(mealId) {
	const mealIds = meal_ids === null ? [] : meal_ids;

	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS() {
	const mealIds = JSON.parse(localStorage.getItem('mealIds'));
	return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(render = false) {
	/* 
	  Fastets method to get favorite meals from LS 
		and append them to favorite meals container 
		without idling too much time 
	*/
	const mealsArr = [];
	const mealIds = meal_ids === null ? [] : meal_ids;
	const repeats = mealIds.length === 1 ? 1 : mealIds.length - 1;
	for (let i = repeats; i >= 0; i--) {
		const mealId = mealIds[i];
		const meal = getMealById(mealId);
		if (render) {
			meal.then((res) => {
				const fav_node = createMealFavNode(res.meals[0]);
				const template = document.createElement('template');
				template.innerHTML = fav_node;
				favoriteContainer.prepend(template.content);
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
	if (!render) return mealsArr;
}

function createMealFavNode(mealData) {
	const fav_meal = `
    <li class="fav" id="${mealData.idMeal}">
      <img
        draggable="false"
        src="${mealData.strMealThumb}/preview"
        alt="${mealData.strMeal}"
      />
      <span title="${mealData.strMeal}">${mealData.strMeal}</span>
    </li>
  `;
	return fav_meal;
}

function removeMealFavEl(mealData) {
	const fav = document.getElementById(mealData.idMeal);
	favoriteContainer.removeChild(fav);
}

main();
