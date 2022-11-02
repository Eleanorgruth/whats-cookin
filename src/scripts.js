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
const resetButton = document.querySelector('#resetButton')
const favoriteRecipeButton = document.querySelector('#favorite-recipe-button')
const homeButton = document.querySelector('#home-button')
const submitButton = document.querySelector('#submit-search-button')
const searchBar = document.querySelector('#search-bar')
const removeRecipeButton = document.querySelector('#remove-recipe-button')

// ~~~~~~~~~~~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~
window.addEventListener('load', fetchData([usersURL, recipesURL, ingredientsURL]))
allRecipes.addEventListener('click', displayRecipeDetailPage)
homeButton.addEventListener('click', displayHomePage)
favoritesView.addEventListener('click', displayRecipeDetailPage)
resetButton.addEventListener('click', resetFilter)
favoriteRecipeButton.addEventListener('click', addRecipeToFavorites)
removeRecipeButton.addEventListener('click', removeRecipeFromFavorites)
favoriteButton.addEventListener('click', displayFavoritesPage)
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
    const hideElementsList = [removeRecipeButton, singleRecipe, favoritesView, favoriteRecipeButton, ingredientSidebar]
    const showElementsList = [allRecipes, favoriteButton, filterSidebar]

    hide(hideElementsList)
    show(showElementsList)
    // hide(removeRecipeButton)
    // show(allRecipes)
    // hide(singleRecipe)
    // hide(favoritesView)
    // hide(favoriteRecipeButton)
    // show(favoriteButton)
    // show(filterSidebar)
    // hide(ingredientSidebar)
    displayAllRecipes()
    homeView = true
}

function displayFavoritesPage() {
    const hideElementsList = [removeRecipeButton, allRecipes, singleRecipe, favoriteRecipeButton, favoriteButton, ingredientSidebar]
    const showElementsList = [favoritesView, filterSidebar]

    hide(hideElementsList)
    show(showElementsList)

    // hide(removeRecipeButton)
    // hide(allRecipes)
    // hide(singleRecipe)
    // show(favoritesView)
    // hide(favoriteRecipeButton)
    // hide(favoriteButton)
    // show(filterSidebar)
    // hide(ingredientSidebar)
    favoritesView.innerHTML = ''
    user.recipesToCook.forEach((current) => {
        displayRecipePreview(current, favoritesView)
    })
    homeView = false
}

function displayRecipeDetailPage(event) {
    const hideElementsList = []
    const showElementsList = []

    console.log("showElementsList: ", showElementsList)

    foundRecipe = recipeRepository.recipes.find((current) => {
        return current.id === findId(event)
    })
    if (user.recipesToCook.length > 0 && user.recipesToCook.includes(foundRecipe)) {
        showElementsList.push(removeRecipeButton)
        console.log("showElementsList: ", showElementsList)
        show(showElementsList)
    } 
    else {
        hideElementsList.push(removeRecipeButton)
        console.log("hideElementsList: ", hideElementsList)
        hide(hideElementsList)
    }
    show([favoriteButton])
    displayRecipeInstructions(event)
    displayRecipeTotalCost(event)
    displayRecipeIngredients(event)
    if(user.recipesToCook.includes(foundRecipe)) {
        hideElementsList.push(favoriteRecipeButton)
        hide(hideElementsList)
        recipe.insertAdjacentHTML("afterBegin", `<p class=recipe-message>This recipe has been added to favorites!</p>`)
    }
}

function displayRecipeInstructions() {
    let instructionsArray = foundRecipe.getInstructions()
    let instructionElement = ''
    const hideElementsList = [favoritesView, allRecipes, filterSidebar]
    const showElementsList = [favoriteRecipeButton, singleRecipe, ingredientSidebar]
    hide(hideElementsList)
    show(showElementsList)
    instructionsArray.forEach(curr => {
        instructionElement += '<p>' + curr + '</p>'
    })
    // show(favoriteRecipeButton)
    // hide(favoritesView)
    // hide(allRecipes)
    // hide(filterSidebar)
    // show(singleRecipe)
    // show(ingredientSidebar)
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
radioButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(homeView) {
            allRecipes.innerHTML = ''
            recipeRepository.filterTag(button.value).forEach(current => {
            displayRecipePreview(current, allRecipes)
            })  
        }
        else if(!homeView)
            favoritesView.innerHTML = ''
            user.filterToCookByTag(button.value).forEach(current => {
            displayRecipePreview(current, favoritesView)
     })
    })
})

function resetFilter() {
    radioButtons.forEach(button => {
        button.checked = false})
    if(homeView) {
        allRecipes.innerHTML = ''
        displayAllRecipes()
    } 
    else {
        favoritesView.innerHTML = ''
        displayFavoritesPage()
    }
}

function searchHomeRecipeByName() {
    allRecipes.innerHTML = ''
    const filteredRecipes = recipeRepository.filterName(searchBar.value.toLowerCase())
    filteredRecipes.forEach((current) => {
        displayRecipePreview(current, allRecipes)
    })
    if(filteredRecipes.length === 0 || searchBar.value === '') {
       allRecipes.innerHTML = `<p>No recipes found. Please search by recipe name, or select a category to filter recipes.</p>`
    }
    searchBar.value = ''
}

function searchFavoriteRecipeByName() {
    favoritesView.innerHTML = ''
    const filteredFavorites = user.filterToCookByName(searchBar.value.toLowerCase())
    filteredFavorites.forEach((current) => {
        displayRecipePreview(current, favoritesView)
    })
    if(filteredFavorites.length === 0 || searchBar.value === '') {
       favoritesView.innerHTML = `<p>No recipes found. Please search by recipe name, or select a category to filter recipes.</p>`
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
    // element.classList.add('hidden')
    elementList.forEach((currentElement) => {
        currentElement.classList.add('hidden')
    })
}

function show(elementList) {
    // element.classList.remove('hidden')
    elementList.forEach((currentElement) => {
        currentElement.classList.remove('hidden')
    })
}

