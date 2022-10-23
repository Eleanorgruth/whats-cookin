import Recipe from "./classes/Recipe";

// ~~~~~~~~~~~~~~ Fetch Calls ~~~~~~~~~~~~~~~~~~~~
const getRecipeData = fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes")
    .then(response => response.json())
    .catch(err => console.log(err))

    // .then(data => {
    //     console.log("API", data.recipeData)
    //     return data.recipeData
    //     })
    // .catch(err => console.log(err))

export { getRecipeData }
