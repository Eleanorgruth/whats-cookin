import Recipe from "./classes/Recipe";

// ~~~~~~~~~~~~~~ Fetch Calls ~~~~~~~~~~~~~~~~~~~~
const getRecipeData = fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes")
    .then(response => response.json())
    .then(data => {
        // return data.recipeData.map(curr => {
        //     const test = new Recipe(curr)
        //     return test
        return data
        })
        
    .catch(err => console.log(err))

export {getRecipeData}
