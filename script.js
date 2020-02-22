// documentation for getting data can be found at https://themealdb.com/api.php

// get DOM hooks
const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const random = document.querySelector('#random');
const mealsEl = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const single_mealEl = document.querySelector('#single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault(); // keep submit from default bahavior

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;
  // console.log(term);

  // check for empty search entry
  // if filled in, fetch data
  // put the searched term in an h2
  // for each result, map through and add the information to a div
  //   including the title and an image and an ID that we assign to a data attribute
  if(term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Results for '${term}'</h2>`;

        // .join() converts the .map array looping to a string
        if(data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
          )
          .join('');
        }
      });
      // Clear search text
      search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
// take the ID of the meal clicked on and get all the data on it
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);

      // since this api returns an array for the meal, set the meal for first item in array
      const meal = data.meals[0];

      // call another function to add the meal to the DOM
      addMealToDOM(meal);
    })
}

// Fetch random meal
function getRandomMeal() {
  // clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  // create an array, we have to make one, because the API doesn't give out the information in an array
  const ingredients = [];

  for(let i = 1; i <= 20; i++) {
    // check if there is an ingredient at index i
    // if there is, push it to our ingredients array
    //  getting it to be the ingredient - measurement
    //  once you come up to an empty one, break out of the for loop
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  
  // write the meal information to the page
  // .join('') at end to output as a string
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : '' }
        ${meal.strArea ? `<p>${meal.strArea}</p>` : '' }
      </div>
      <div class="main">
        <p>${meal.strInstructions} This is the instructions.</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

// when we click inside the meals area
//   path.find will go through all the child elements
//   we need to limit the items to the one tht has the meal-info class
//   if statement to check for a class and return for the one that contains the class 'meal-info'
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    // get the item that contains 'meal-info'
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  // console.log(mealInfo);

  // if mealInfo exists (the if statement above returned true), get the ID of the meal clicked on
  // then send the ID to a getMealByID() function to use the ID to get further information on the meal
  if(mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    // console.log(mealID);

    getMealByID(mealID);
  }
});