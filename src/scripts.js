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

const usersURL = 'http://localhost:3001/api/v1/users'
const recipesURL = 'http://localhost:3001/api/v1/recipes'
const ingredientsURL = 'http://localhost:3001/api/v1/ingredients'

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
const resetButton = document.querySelector('#resetButton')
const favoriteRecipeButton = document.querySelector('#favorite-recipe-button')
const homeButton = document.querySelector('#home-button')
const submitButton = document.querySelector('#submit-search-button')
const searchBar = document.querySelector('#search-bar')
const removeRecipeButton = document.querySelector('#remove-recipe-button')
const pantryButton = document.querySelector('#pantry-button')
const pantryView = document.querySelector('#pantry-view')
const addButton = document.querySelector('#add-button')
const selectIngredient = document.querySelector('#ingredient-drop-down-menu')
const pantryTable = document.querySelector('#pantry-table')
const navMessage = document.querySelector('.current-view-message')


// ~~~~~~~~~~~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~
window.addEventListener('load', fetchData([usersURL, recipesURL, ingredientsURL]))
allRecipes.addEventListener('click', displayRecipeDetailPage)
homeButton.addEventListener('click', displayHomePage)
favoritesView.addEventListener('click', displayRecipeDetailPage)
resetButton.addEventListener('click', resetFilter)
favoriteRecipeButton.addEventListener('click', addRecipeToFavorites)
removeRecipeButton.addEventListener('click', removeRecipeFromFavorites)
favoriteButton.addEventListener('click', displayFavoritesPage)
pantryButton.addEventListener('click', displayPantryPage)
searchBar.addEventListener('keypress', (event) => {
    if (event.key === "Enter" && homeView) {
        event.preventDefault()
        searchHomeRecipeByName()
    } else if (event.key === "Enter" && !homeView) {
        event.preventDefault()
        searchFavoriteRecipeByName()
    }
})
submitButton.addEventListener('click', () => {
    if (homeView) {
        searchHomeRecipeByName()
    } else {
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
            recipeRepository = new RecipeRepository(apiRecipes)
            ingredients = new Ingredients(apiIngredients)
            user = new User(apiUsers)
            displayAllRecipes()
            randomizeUser(apiUsers)
            displayIngredientDropDown()
            addOrRemoveToPantry(user)
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
    navMessage.innerText = 'All Recipes'
    hide([removeRecipeButton, singleRecipe, favoritesView, favoriteRecipeButton, ingredientSidebar, pantryView])
    show([allRecipes, favoriteButton, filterSidebar, pantryButton])
    displayAllRecipes()
    homeView = true
}

function displayFavoritesPage() {
    hide([removeRecipeButton, allRecipes, singleRecipe, favoriteRecipeButton, favoriteButton, ingredientSidebar])
    show([favoritesView, filterSidebar])
    favoritesView.innerHTML = ''
    navMessage.innerText = 'All Favorite Recipes'
    if(user.recipesToCook.length === 0){
        favoritesView.innerHTML = `<p>You have no saved recipes</p>`
    }
    user.recipesToCook.forEach((current) => {
        displayRecipePreview(current, favoritesView)
    })
    homeView = false
}

function displayPantryPage() {
    navMessage.innerText = 'Pantry'
    hide([removeRecipeButton, pantryButton, allRecipes, singleRecipe, favoritesView, favoriteRecipeButton, favoriteButton, ingredientSidebar, filterSidebar])
    show([pantryView])
    homeView = false
}

function displayRecipeDetailPage(event) {
    navMessage.innerText = ''
    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event)
    })
    if (user.recipesToCook.length > 0 && user.recipesToCook.includes(foundRecipe)) {
        show([removeRecipeButton])
    } 
    else {
        hide([removeRecipeButton])
    }
    show([favoriteButton])
    displayRecipeInstructions(event)
    displayRecipeTotalCost(event)
    displayRecipeIngredients(event)
    if(user.recipesToCook.includes(foundRecipe)) {
        hide([favoriteRecipeButton])
        recipe.insertAdjacentHTML("afterBegin", `<p class=recipe-message>This recipe has been added to favorites!</p>`)
    }
}

function displayRecipeInstructions() {
    let instructionsArray = foundRecipe.getInstructions()
    let instructionElement = ''
    hide([favoritesView, allRecipes, filterSidebar])
    show([favoriteRecipeButton, singleRecipe, ingredientSidebar])
    instructionsArray.forEach(curr => {
        instructionElement += '<p>' + curr + '</p>'
    })
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
        ingredientList.innerHTML += `<li>${item.ingredient}</li>`
    })
}

function displayRecipeTotalCost() {
    totalCost.innerText = `$ ${foundRecipe.calculateCost(ingredients.ingredients)}`
}

// ~~~~~~~~~~~~~~ Filter Functions ~~~~~~~~~~~~~~~~~~~~
radioButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(homeView){
            allRecipes.innerHTML = ''
            navMessage.innerText = capitalizeFirstLetter(button.value) + " Recipes"
            recipeRepository.filterTag(button.value).forEach(current => {
            displayRecipePreview(current, allRecipes)
            })
        }
        else if(!homeView && user.filterToCookByTag(button.value).length > 0){
            favoritesView.innerHTML = ''
            navMessage.innerText = "All Favorite " + capitalizeFirstLetter(button.value) + " Recipes"
            user.filterToCookByTag(button.value).forEach(current => {
            displayRecipePreview(current, favoritesView)
            })     
        }
        else{
            navMessage.innerText = "Oops!"
            favoritesView.innerHTML = `<p>No recipe found. Please search by name or category to filter recipes.</p>`
        }
    })
})

function resetFilter() {
    radioButtons.forEach(button => {
        button.checked = false})
    if(homeView) {
        allRecipes.innerHTML = ''
        navMessage.innerText = 'All Recipes'
        displayAllRecipes()
    }
    else {
        favoritesView.innerHTML = ''
        navMessage.innerText = 'All Favorite Recipes'
        displayFavoritesPage()
    }
}

function searchHomeRecipeByName() {
    allRecipes.innerHTML = ''
    let filteredList = []
    const filtersByNameList = recipeRepository.filterName(searchBar.value.toLowerCase())
    const filtersByTagList = recipeRepository.filterTag(searchBar.value.toLowerCase())
    if(filtersByNameList.length > 0 && searchBar.value != ''){
        navMessage.innerText = capitalizeFirstLetter(searchBar.value) + " Recipes"
        filteredList = filtersByNameList
        filteredList.forEach((currentRecipe) => {
            displayRecipePreview(currentRecipe, allRecipes)
        })
    }
    else if(filtersByTagList.length > 0 && searchBar.value != ''){
        navMessage.innerText = capitalizeFirstLetter(searchBar.value) + " Recipes"
        filteredList = filtersByTagList
        filteredList.forEach((currentRecipe) => {
            displayRecipePreview(currentRecipe, allRecipes)
        })
    }
    else{
        navMessage.innerText = "Oops!"
        allRecipes.innerHTML = `<p>No recipe found. Please search by name or category to filter recipes.</p>`
    }
    searchBar.value = ''
}

function searchFavoriteRecipeByName() {
    favoritesView.innerHTML = ''
    let filteredList = []
    const filtersByNameList = user.filterToCookByName(searchBar.value.toLowerCase())
    const filtersByTagList = user.filterToCookByTag(searchBar.value.toLowerCase())
    if(filtersByNameList.length > 0 && searchBar.value != ''){
        navMessage.innerText = "All Favorite " + capitalizeFirstLetter(searchBar.value) + " Recipes"
        filteredList = filtersByNameList
        filteredList.forEach((currentRecipe) => {
            displayRecipePreview(currentRecipe, favoritesView)
        })
    }
    else if(filtersByTagList.length > 0 && searchBar.value != ''){
        navMessage.innerText = "All Favorite " + capitalizeFirstLetter(searchBar.value) + " Recipes"
        filteredList = filtersByTagList
        filteredList.forEach((currentRecipe) => {
            displayRecipePreview(currentRecipe, favoritesView)
        })
    }
    else{
        navMessage.innerText = "Oops!"
        favoritesView.innerHTML = `<p>No recipe found. Please search by name or category to filter recipes.</p>`
    }
    searchBar.value = ''
}

// ~~~~~~~~~~~~~~ Add/Delete Functions ~~~~~~~~~~~~~~~~~~~~
function addRecipeToFavorites() {
    hide([favoriteRecipeButton])
    recipe.insertAdjacentHTML("afterBegin", `<p class=recipe-message>This recipe has been added to favorites!</p>`)
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

function hide(elementList) {
    elementList.forEach((currentElement) => {
        currentElement.classList.add('hidden')
    })
}

function show(elementList) {
    elementList.forEach((currentElement) => {
        currentElement.classList.remove('hidden')
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayIngredientDropDown() {
    const sortedIngredients = apiIngredients.sort((a, b) => a.name.localeCompare(b.name))
    selectIngredient.innerHTML = ''
    selectIngredient.innerHTML = `<option value="Choose Ingredient">Choose Ingredient...</option>`
    sortedIngredients.forEach(ingredient => {
        selectIngredient.innerHTML += `
        <option value="Choose Ingredient">${ingredient.name}</option>`
    })
}

function addOrRemoveToPantry(user) {
    pantryTable.innerHTML = ''
    const amount = apiIngredients.reduce((acc, value) => {
        user.pantry.forEach(current => {
            if(value.id === current.ingredient) {
            var object = {['Ingredient']: value.name, ['Amount']: current.amount}
            acc.push(object)
            }
        })
        return acc
    }, []).forEach(value => {
        pantryTable.innerHTML += `
            <div class="boxI">${value.Ingredient}</div>
            <div class="boxA">${value.Amount}</div>
            <button type="button" class="miniButtons">-</button>
            <button type="button" class="miniButtons">+</button>
            `
    })
    return amount
}

