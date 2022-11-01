// ~~~~~~~~~~~~~~ File Imports ~~~~~~~~~~~~~~~~~~~~
import getData from './apiCalls'
import RecipeRepository from './classes/RecipeRepository'
import Ingredients from './classes/Ingredients'
import User from './classes/User'
import './styles.css'

// ~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~
let recipeRepository
let ingredients
let randomUser
let user
let foundRecipe
let homeView = true
let apiUsers
let apiRecipes
let apiIngredients

const usersURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users'
const recipesURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes'
const ingredientsURL = 'https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients'

// ~~~~~~~~~~~~~~ Query Selectors ~~~~~~~~~~~~~~~~~~~~
const allRecipes = document.querySelector('#recipeRepository')
const singleRecipe = document.querySelector('#recipe')
const filterSidebar = document.querySelector('#filterSection')
const ingredientSidebar = document.querySelector('#ingredientSection')
const userName = document.querySelector('#user-info')
const favoritesView = document.querySelector('#favorites-view')
const favoriteButton = document.querySelector('#favorited-recipe-button')
const totalCost = document.querySelector('#totalCost')
const ingredientList = document.querySelector('#ingredientList')
const radioButtons = document.querySelectorAll('.food-category')
const submitTagButton = document.querySelector('#submitTagButton')
const favoriteRecipeButton = document.querySelector('#favorite-recipe-button')
const homeButton = document.querySelector('#home-button')
const submitButton = document.querySelector('#submit-search-button')
const searchBar = document.querySelector('#search-bar')
const removeRecipeButton = document.querySelector('#remove-recipe-button')
const currentView = document.querySelector('.current-view-message')

// ~~~~~~~~~~~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~
window.addEventListener('load', fetchData([usersURL, recipesURL, ingredientsURL]))
allRecipes.addEventListener('click', displayRecipeDetailPage)
homeButton.addEventListener('click', displayHomePage)
favoritesView.addEventListener('click', displayRecipeDetailPage)
submitTagButton.addEventListener('click', searchHomeRecipeByTag)
submitTagButton.addEventListener('click', searchFavoriteRecipeByTag)
favoriteRecipeButton.addEventListener('click', addRecipeToFavorites)
removeRecipeButton.addEventListener('click', removeRecipeFromFavorites)
favoriteButton.addEventListener('click', displayFavoritesPage)
submitButton.addEventListener('click', () => {
    if (homeView) {
        searchHomeRecipeByName()
    }
    else {
        searchFavoriteRecipeByName()
    }
})

// ~~~~~~~~~~~~~~ Setup Functions ~~~~~~~~~~~~~~~~~~~~
function fetchData(urls) {
    Promise.all([getData(urls[0]), getData(urls[1]), getData(urls[2])])
        .then(data => {
            apiUsers = data[0]
            apiRecipes = data[1]
            apiIngredients = data[2]
            recipeRepository = new RecipeRepository(apiRecipes.recipeData)
            ingredients = new Ingredients(apiIngredients.ingredientsData)
            displayAllRecipes()
            randomizeUser(apiUsers.usersData)
        })
        .catch(err => console.log('Fetch Error: ', err))
}

function displayAllRecipes() {
    return recipeRepository.recipes.forEach((current) => {
        displayRecipePreview(current, allRecipes)
    })
}

function randomizeUser(data) {
    randomUser = data[Math.floor(Math.random() * data.length)]
    user = new User(randomUser)
    displayWelcomeMessage(user.name)
    return user
}

// ~~~~~~~~~~~~~~ Main View Functions ~~~~~~~~~~~~~~~~~~~~
function displayHomePage() {
    allRecipes.innerHTML = ''
    currentView.innerText = 'All Recipes'
    hide(removeRecipeButton)
    show(allRecipes)
    hide(singleRecipe)
    hide(favoritesView)
    hide(favoriteRecipeButton)
    show(favoriteButton)
    show(filterSidebar)
    hide(ingredientSidebar)
    displayAllRecipes()
    homeView = true
}

function displayFavoritesPage() {
    currentView.innerText = 'Favorite Recipes'
    hide(removeRecipeButton)
    hide(allRecipes)
    hide(singleRecipe)
    show(favoritesView)
    hide(favoriteRecipeButton)
    hide(favoriteButton)
    show(filterSidebar)
    hide(ingredientSidebar)
    favoritesView.innerHTML = ''
    user.recipesToCook.forEach((current) => {
        displayRecipePreview(current, favoritesView)
    })
    homeView = false
}

function displayRecipeDetailPage(event) {
    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event)
    })
    if (user.recipesToCook.length > 0 && user.recipesToCook.includes(foundRecipe)) {
        show(removeRecipeButton)
    } else {hide(removeRecipeButton)}
    // currentView.innerText = foundRecipe.name
    show(favoriteButton)
    displayRecipeInstructions(event)
    displayRecipeTotalCost(event)
    displayRecipeIngredients(event)
}

function displayRecipeInstructions() {
    let instructionsArray = foundRecipe.getInstructions()
    let instructionElement = ''
    instructionsArray.forEach(curr => {
        instructionElement += '<p>' + curr + '</p>'
    })
    show(favoriteRecipeButton)
    hide(favoritesView)
    hide(allRecipes)
    hide(filterSidebar)
    show(singleRecipe)
    show(ingredientSidebar)
    singleRecipe.innerHTML = `
        <img src='${foundRecipe.image}' alt='${foundRecipe.name}'>
        <section class='instructions'>
          <h2>${foundRecipe.name}</h2>
          ${instructionElement}
        </section>`
    return foundRecipe
}

// ~~~~~~~~~~~~~~ Sidebar View Functions ~~~~~~~~~~~~~~~~~~~~
function displayRecipeIngredients() {
    let listOfIngredients = foundRecipe.determineIngredients(ingredients.ingredients)
    ingredientList.innerHTML = ''
    listOfIngredients.forEach((item) => {
        ingredientList.innerHTML += `<p>${item.ingredient}</p>`
    })
}

function displayRecipeTotalCost() {
    totalCost.innerText = `$ ${foundRecipe.calculateCost(ingredients.ingredients)}`
}

// ~~~~~~~~~~~~~~ Filter Functions ~~~~~~~~~~~~~~~~~~~~
function searchHomeRecipeByTag() {
    const tagSelected = determineSelectedTagValue()
    const tagSelectedList = recipeRepository.filterTag(tagSelected)
    allRecipes.innerHTML = ''
    if (tagSelected === 'reset all') {
        displayAllRecipes()
    }
    else {
        return tagSelectedList.forEach((current) => {
            displayRecipePreview(current, allRecipes)
        })
    }
}

function searchFavoriteRecipeByTag() {
    const tagSelected = determineSelectedTagValue()
    const favList = user.recipesToCook
    const tagSelectedList = user.filterToCookByTag(tagSelected)
    favoritesView.innerHTML = ''
    if (tagSelected === 'reset all') {
        return favList.forEach((current) => {
            displayRecipePreview(current, favoritesView)
        })
    }
    else {
        return tagSelectedList.forEach((current) => {
            displayRecipePreview(current, favoritesView)
        })
    }
}

function searchHomeRecipeByName() {
    allRecipes.innerHTML = ''
    const filteredRecipes = recipeRepository.filterName(searchBar.value.toLowerCase())
    filteredRecipes.forEach((current) => {
        displayRecipePreview(current, allRecipes)
    })
    searchBar.value = ''
}

function searchFavoriteRecipeByName() {
    favoritesView.innerHTML = ''
    const filteredFavorites = user.filterToCookByName(searchBar.value.toLowerCase())
    filteredFavorites.forEach((current) => {
        displayRecipePreview(current, favoritesView)
    })
    searchBar.value = ''
}

// ~~~~~~~~~~~~~~ Add/Delete Functions ~~~~~~~~~~~~~~~~~~~~
function addRecipeToFavorites() {
    return user.addRecipesToCook(foundRecipe)
}

function removeRecipeFromFavorites() {
    if (user.recipesToCook.includes(foundRecipe)) {
        user.removeRecipesToCook(foundRecipe)
        resetView()
    }
}

// ~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~
function displayRecipePreview(current, view) {
    view.innerHTML += `
    <div class = 'fullwrap' id='${current.id}'>
    <img src='${current.image}' alt='${current.name}'>
    <div class='fullcap'>
        ${current.name}
    </div>
    </div>
    `
}

function displayWelcomeMessage(user) {
    userName.innerText = `Welcome, ${user}!`
}

function determineSelectedTagValue() {
    let messageType = ''
    radioButtons.forEach((currentRadioButton) => {
        if (currentRadioButton.checked) {
            messageType = currentRadioButton.value
        }
    })
    return messageType
}

function findId(event) {
    let recipeId = Number(event.target.parentElement.id)
    return recipeId
}

function resetView() {
    if (user.recipesToCook.length > 0) {
        displayFavoritesPage()
    }
    else {
        displayHomePage()
    }
}

function hide(element) {
    element.classList.add('hidden')
}

function show(element) {
    element.classList.remove('hidden')
}
