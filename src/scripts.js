import apiCalls from './apiCalls';
import './styles.css';
import RecipeRepository from './classes/RecipeRepository';
import Recipe from "./classes/Recipe";
import { sampleRecipeData } from './data/sample-data';
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// As a user, I should be able to view a list of all recipes.
// As a user, I should be able to click on a recipe to view more information including directions, ingredients needed, and total cost.
// As a user, I should be able to filter recipes by a tag. (Extension option: by multiple tags)
// As a user, I should be able to search recipes by their name. (Extension option: by name or ingredients)

// ~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~
let recipeRepository;

// ~~~~~~~~~~~~~~ Query Selectors ~~~~~~~~~~~~~~~~~~~~
const allRecipes = document.querySelector("#recipeRepository");
const singleRecipe = document.querySelector("#recipe");
const filterSidebar = document.querySelector("#filterSection");
const ingredientSidebar = document.querySelector("#ingredientSection")

// ~~~~~~~~~~~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~
window.addEventListener('load', displayAllRecipes);
// allRecipes.addEventListener('click', findId);
allRecipes.addEventListener('click', viewRecipeDetail);
// ~~~~~~~~~~~~~~ Functions ~~~~~~~~~~~~~~~~~~~~

function displayAllRecipes() {
    recipeRepository = new RecipeRepository(sampleRecipeData);

    const recipeDisplayList = recipeRepository.recipes.reduce((acc, current) => {
        const recipeData = {};
        recipeData.imageURL = current.image;
        recipeData.name = current.name;
        acc.push(recipeData);
        recipeData.id = current.id;
        return acc;
    }, [])
    .forEach((current) => {
        allRecipes.innerHTML += `
            <div class= "fullwrap" id="${current.id}">
                <img src="${current.imageURL}" alt="${current.name}">
                <div class="fullcap"> 
                    ${current.name}
                </div>
            </div>`
    })
};

function findId(event){
    const recipeId = Number(event.target.parentElement.id);
    hide(allRecipes);
    hide(filterSidebar);
    show(singleRecipe);
    show(ingredientSidebar);

    return recipeId;
}

function viewRecipeDetail(event) {

    //GOAL: iterate through sample data list that matches 
    // our id, and return object containing url, name, instructions, cost
    //INFO: We are given a id number (represents a recipe)

    const foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event);
    })

    console.log

    singleRecipe.innerHTML += `
        <img src="${foundRecipe.image}">
        <section class="instructions">
          <h2>TEST</h2>
          <p>Poop</p>
        </section>`

    console.log("here:", foundRecipe);
    return foundRecipe;
};



// function viewRecipeDetail(event) {
//     console.log(event.target.parentElement)
//     if(event.target.parentElement.id === "595736") {
//         console.log("Cookies, Yay")
//     };
   
//     hide(allRecipes);
//     hide(filterSidebar);
//     show(singleRecipe);
//     show(ingredientSidebar);
// };

// ~~~~~~~ Helper Functions ~~~~~~~

function hide(element) {
    element.classList.add("hidden");
  };
   function show(element) {
    element.classList.remove("hidden");
  };