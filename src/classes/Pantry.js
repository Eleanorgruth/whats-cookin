class Pantry {
  constructor(pantryData) {
    this.pantryData = pantryData;
    this.ingredientsNeeded = [];
    this.userCanCook = true
  }
 determineIngredientsNeeded(recipe) {
  const recipeIngredientIDList = recipe.ingredients.map((recipeIngredient) => {
    return recipeIngredient.id
  })
  const userPantryIDList = this.pantryData.map((pantryIngredient) => {
    return pantryIngredient.ingredient
  })

  this.ingredientsNeeded = recipeIngredientIDList.reduce((acc, recipeID) => {
    var recipeIngredientToBeChecked = recipe.ingredients.find((ingredient) => {
      if (ingredient.id === recipeID) {
        return ingredient
      }
    })
    var pantryIngredientToBeChecked = this.pantryData.find((ingredient) => {
      if (ingredient.ingredient === recipeID) {
        return ingredient
      }
    })
    if (!userPantryIDList.includes(recipeID)) {
      acc.push({missingIngredient: recipeID, quantityNeeded: recipeIngredientToBeChecked.quantity.amount})
      return acc
    } else if (userPantryIDList.includes(recipeID)) {
      if ([recipeIngredientToBeChecked.quantity.amount] > [pantryIngredientToBeChecked.amount]) {
        acc.push({missingIngredient: recipeID, quantityNeeded: [recipeIngredientToBeChecked.quantity.amount] - [pantryIngredientToBeChecked.amount] })
      }
      return acc
    }
  }, [])
  return this.ingredientsNeeded
}
checkPantryForIngredients(recipe) {
  this.determineIngredientsNeeded(recipe)
  if(this.ingredientsNeeded.length > 0) {
    this.userCanCook = false
  }
}
}
export default Pantry

