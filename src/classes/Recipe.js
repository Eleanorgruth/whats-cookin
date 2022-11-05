class Recipe {
  constructor(recipeData) {
    this.id = recipeData.id
    this.image = recipeData.image
    this.ingredients = recipeData.ingredients
    this.instructions = recipeData.instructions
    this.name = recipeData.name
    this.tags = recipeData.tags
    this.ingredientsList = []
    this.totalCost
  }
  determineIngredients(ingredientInfo) {
    this.ingredientsList = ingredientInfo.reduce((acc, ingredient) => {
      this.ingredients.forEach((item) => {
        if (item.id === ingredient.id) {
          let name = ingredient.name
          let list = { ingredient: `${item.quantity.amount.toFixed(2)} ${item.quantity.unit} ${name}`}
          acc.push(list)
        }
      })
      return this.ingredientsList = acc
    }, [])
    return this.ingredientsList
  }
  calculateCost(ingredientInfo) {
    this.totalCost = ingredientInfo.reduce((total, ingredient) => {
      this.ingredients.forEach((item) => {
        if (item.id === ingredient.id) {
          let cost = (item.quantity.amount * ingredient.estimatedCostInCents) / 100
          return total += cost
        }
      })
      return total
    }, 0)
    return Number(this.totalCost.toFixed(2))
  }
  getInstructions() {
    return this.instructions.reduce((instructionArray, direction) => {
      instructionArray.push(`${direction.number}. ${direction.instruction}`)
      return instructionArray
    }, [])
  }
}

export default Recipe
