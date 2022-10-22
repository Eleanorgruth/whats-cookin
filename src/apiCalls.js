import Recipe from "./classes/Recipe";

// ~~~~~~~~~~~~~~ Fetch Calls ~~~~~~~~~~~~~~~~~~~~
const recipeData1 = fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes")
    .then(response => response.json())
    .then(data => {
        console.log("hello", data.recipeData);
        return data.recipeData.map(curr => {
            const test = new Recipe(curr)
            console.log("TEST", test)
            return test
        })
    })
    .catch(err => console.log(err));

    export const recipeAPIData = Promise.all([recipeData1]).then(values => {
        console.log("VALUES", values)
    })

console.log('I will be a fetch request!');

export {recipeData1}
