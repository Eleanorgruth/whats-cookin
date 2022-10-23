import {getRecipeData, getIngredientsData, getUserData} from './apiCalls';
import './styles.css';
import RecipeRepository from './classes/RecipeRepository';
import Recipe from "./classes/Recipe";
import User from "./classes/User";


// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import Ingredients from './classes/Ingredients';

// ~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~
let recipeRepository;
let ingredients
let randomUser;
let user;
let foundRecipe;
//let listOfIngredients
let homeView = true;

let apiUsers
let apiRecipes
let apiIngredients 


function fetchData() {
    Promise.all([getUserData, getRecipeData, getIngredientsData])
    .then(data => {
        apiUsers = data[0]
        apiRecipes = data[1]
        apiIngredients = data[2]
        recipeRepository = new RecipeRepository(apiRecipes.recipeData);
        ingredients = new Ingredients(apiIngredients.ingredientsData)
        displayAllRecipes()
        randomizeUser(apiUsers.usersData)
    })
    //.catch
}

window.addEventListener('load', fetchData);

// ~~~~~~~~~~~~~~ Query Selectors ~~~~~~~~~~~~~~~~~~~~
const allRecipes = document.querySelector("#recipeRepository");
const singleRecipe = document.querySelector("#recipe");
const filterSidebar = document.querySelector("#filterSection");
const ingredientSidebar = document.querySelector("#ingredientSection")
const userName = document.querySelector('#user-info');
const favoritesView = document.querySelector('#favorites-view');
const savedButton = document.querySelector('#saved-recipe-button');
const totalCost = document.querySelector('#totalCost')
const ingredientList = document.querySelector('#ingredientList');
let radioButtons = document.querySelectorAll('.food-category');
let submitTagButton = document.querySelector("#submitTagButton");
const saveRecipeButton = document.querySelector('#favorite-recipe-button')
const homeButton = document.querySelector('#home-button')
const submitButton = document.querySelector('#submit-search-button')
const searchBar = document.querySelector('#search-bar')
const deleteInstructions = document.querySelector('#delete-instructions')


// ~~~~~~~~~~~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~
allRecipes.addEventListener('click', viewRecipeDetail);
//window.addEventListener('load', displayAllRecipes);
//window.addEventListener('load', displayWelcomeMessage);
savedButton.addEventListener('click', displayFavorites);
submitTagButton.addEventListener('click', displayFilteredTag);
submitTagButton.addEventListener('click', displayFilteredFavorite)
saveRecipeButton.addEventListener('click', addRecipeToFavorites);
homeButton.addEventListener('click', displayHomePage);
favoritesView.addEventListener('dblclick', removeFromFavorites);
favoritesView.addEventListener('click', viewRecipeDetail);
///////WIP
favoritesView.addEventListener('click', deleteFavoriteRecipe);

submitButton.addEventListener('click', () => {
    if(homeView) {searchForRecipe()}
    else {searchFavorites()}
});

// ~~~~~~~~~~~~~~ Functions ~~~~~~~~~~~~~~~~~~~~

function checkTagType(){
    let messageType = "";
    radioButtons.forEach((currentRadioButton) => {
        if(currentRadioButton.checked){
            messageType = currentRadioButton.value;
        }
    })
    return messageType;
}

function displayFilteredTag(){
    const tagSelected = checkTagType();
    const tagSelectedList = recipeRepository.filterTag(tagSelected)

    allRecipes.innerHTML = ""

    if(tagSelected === "reset all"){
        displayAllRecipes();
    }
    else{
        return tagSelectedList.forEach((current) => {
            displayRecipePreview(current, allRecipes)
        });
    };
};

function displayFilteredFavorite() {
    const tagSelected = checkTagType();
    const favList = user.recipesToCook
    const tagSelectedList = user.filterToCookByTag(tagSelected)
   
    favoritesView.innerHTML = ""

    if(tagSelected === "reset all"){
        return favList.forEach((current) => {
            displayRecipePreview(current, favoritesView)
        });
    }
    else{
        return tagSelectedList.forEach((current) => {
            displayRecipePreview(current, favoritesView)
        });
    };
}

function displayAllRecipes() {
    hide(deleteInstructions)
    return recipeRepository.recipes.forEach((current) => {
        displayRecipePreview(current, allRecipes)
    })
}

///**90% delete feature complete. Need to fix: show recipe details in 
///favotire view ***/
/////////WIP
function viewRecipeDetail(event) {
    if(event.target.classList.contains('fullcap')){
        hide(deleteInstructions)
        viewRecipeInstructions(event);
        viewRecipeTotalCost(event);
        viewRecipeIngredients(event);
    }
}

function viewRecipeIngredients(event) {
  foundRecipe = recipeRepository.recipes.find((current) => {
      return current.id === findId(event);
  });

    let listOfIngredients = foundRecipe.determineIngredients(ingredients.ingredients);
  ingredientList.innerHTML = ''
  listOfIngredients.forEach((item) => {
        ingredientList.innerHTML += `<p>${item.ingredient}</p>`;
  });
};

function viewRecipeInstructions(event) {
    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event);
    });

    let instructionsArray = foundRecipe.getInstructions();
    let instructionElement = "";

    instructionsArray.forEach(curr => {
      instructionElement += "<p>" + curr + "</p>"
    });

    singleRecipe.innerHTML += `
        <img src="${foundRecipe.image}" alt="${foundRecipe.name}">
        <section class="instructions">
          <h2>${foundRecipe.name}</h2>
          ${instructionElement}`
          
    show(saveRecipeButton);
    hide(favoritesView);
    hide(allRecipes);
    hide(filterSidebar);
    show(singleRecipe);
    show(ingredientSidebar);
    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event);
    })
    singleRecipe.innerHTML = `
        <img src="${foundRecipe.image}" alt="${foundRecipe.name}">
        <section class="instructions">
          <h2>${foundRecipe.name}</h2>
          ${instructionElement}
        </section>`
    return foundRecipe;
};

function viewRecipeTotalCost(event) {
    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event);
    })
    totalCost.innerText = `$ ${foundRecipe.calculateCost(ingredients.ingredients)}`
  };

function randomizeUser(data) {
    randomUser = data[Math.floor(Math.random() * data.length)]
    user = new User(randomUser);
    displayWelcomeMessage(user.name)
    return user
};

function displayWelcomeMessage(user) {
    userName.innerText = `Welcome, ${user}!`
   
};

function addRecipeToFavorites() {
    return user.addRecipesToCook(foundRecipe);
};

function displayFavorites(event) {
   hide(allRecipes);
   hide(singleRecipe);
   show(favoritesView);
   hide(saveRecipeButton);
   hide(savedButton);
   show(filterSidebar);
   hide(ingredientSidebar);
   show(deleteInstructions)
   favoritesView.innerHTML = '';

   user.recipesToCook.forEach((current) => {
    console.log("currentid", current.id);
    favoritesView.innerHTML += `
    <div class = "favorite-module">
    <div class = "fullwrap" id="${current.id}">
    <img src="${current.image}" alt="${current.name}">
    <div class="fullcap">
        ${current.name}
    </div>
    </div>
    <button type="button" class="delete-button" id="${current.id}">Delete</button>
    </div>`
    });
    homeView = false;
}

///////////WIP
function deleteFavoriteRecipe(event){
    if(event.target.classList.contains('delete-button')){
        console.log("delete:", Number(event.target.id))
    }
    const favoriteList = user.recipesToCook;

    console.log("favoriteList BEFORE:", favoriteList);
    foundRecipe = favoriteList.find((current) => {
        return current.id === Number(event.target.id);
    });
    console.log("found recipe to delete:", foundRecipe);
    user.removeRecipesToCook(foundRecipe)
    console.log("favoriteList AFTER:", favoriteList);

    displayFavorites(event);

}

function displayHomePage() {
    allRecipes.innerHTML = '';
    show(allRecipes);
    hide(singleRecipe);
    hide(favoritesView);
    hide(saveRecipeButton);
    show(savedButton);
    show(filterSidebar);
    hide(ingredientSidebar);
    hide(deleteInstructions);
    displayAllRecipes();
    homeView = true;
}

function removeFromFavorites() {
    user.removeRecipesToCook(foundRecipe);
    displayFavorites();
}

function searchForRecipe() {
    allRecipes.innerHTML= '';
   const filteredRecipes = recipeRepository.filterName(searchBar.value.toLowerCase())
   filteredRecipes.forEach((current) => {
       displayRecipePreview(current, allRecipes)
   });
searchBar.value = '';
};

function searchFavorites() {
    favoritesView.innerHTML = '';
   const filteredFavorites = user.filterToCookByName(searchBar.value.toLowerCase())
   filteredFavorites.forEach((current) => {
       displayRecipePreview(current, favoritesView)
   })
searchBar.value = '';
}

// ~~~~~~~ Helper Functions ~~~~~~~

function hide(element) {
    element.classList.add("hidden");
  };

function show(element) {
    element.classList.remove("hidden");
  };

function displayRecipePreview(current, view) {
    view.innerHTML += `
    <div class = "fullwrap" id="${current.id}">
    <img src="${current.image}" alt="${current.name}">
    <div class="fullcap">
        ${current.name}
    </div>
    </div>
    `
};

 function findId(event){
    let recipeId = Number(event.target.parentElement.id);
    hide(allRecipes);
    hide(filterSidebar);
    show(singleRecipe);
    show(ingredientSidebar);

    return recipeId;
};
