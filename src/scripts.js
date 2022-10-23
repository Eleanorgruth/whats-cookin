import getData from './apiCalls';
import './styles.css';
import RecipeRepository from './classes/RecipeRepository';
import Recipe from "./classes/Recipe";
import User from "./classes/User";


// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// ~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~
let recipeRepository;
let randomUser;
let user;
let foundRecipe;
//let listOfIngredients
let homeView = true;

let apiUsers
let apiRecipes
let apiIngredients 

const userURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users'
const recipeURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes'
const ingredientURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients'

function fetchData(urls) {
    Promise.all([getData(urls[0]), getData(urls[1]), getData(urls[2])])
    .then(data => {
        apiUsers = data[0]
        apiRecipes = data[1]
        apiIngredients = data[2]
        //console.log(apiRecipes.recipeData)
        //console.log(apiUsers.usersData)
        recipeRepository = new RecipeRepository(apiRecipes.recipeData, apiIngredients.ingredientsData);
        console.log("recipeRepository", recipeRepository)
        displayAllRecipes()
        randomUser = apiUsers.usersData[Math.floor(Math.random() * apiUsers.usersData.length)]
        randomizeUser(apiUsers.usersData)
        //console.log("apiIngredient.ingredientsData", apiIngredients.ingredientsData)
    
    })
}
fetchData([userURL, recipeURL, ingredientURL])


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
    return recipeRepository.recipes.forEach((current) => {
        displayRecipePreview(current, allRecipes)
    })
}

function viewRecipeDetail(event) {
  viewRecipeInstructions(event);
  viewRecipeTotalCost(event);
  viewRecipeIngredients(event);
}

function viewRecipeIngredients(event) {
  foundRecipe = recipeRepository.recipes.find((current) => {
      return current.id === findId(event);
  });

    let listOfIngredients = foundRecipe.determineIngredients(recipeRepository.ingredients);
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
    totalCost.innerText = `$ ${foundRecipe.calculateCost(recipeRepository.ingredients)}`
  };

function randomizeUser() {
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

function displayFavorites() {
   hide(allRecipes);
   hide(singleRecipe);
   show(favoritesView);
   hide(saveRecipeButton);
   hide(savedButton);
   show(filterSidebar);
   hide(ingredientSidebar);
   favoritesView.innerHTML = '';
   user.recipesToCook.forEach((current) => {
    displayRecipePreview(current, favoritesView)
    });
    homeView = false;
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
