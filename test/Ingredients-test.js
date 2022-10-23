import { expect } from 'chai';
import Ingredients from '../src/classes/Ingredients';
import { sampleIngredientsData } from '../src/data/sample-data';


describe('Ingredients', () => {
  sampleIngredientsData
  let ingredients

  beforeEach(() => {
    sampleIngredientsData;
    ingredients = new Ingredients(sampleIngredientsData)
  });

  it('Should be a function', () => {
    expect(Ingredients).to.be.a('function');
  });

  it('Should have a property of ingredients', () => {
    expect(ingredients.ingredients).to.deep.equal(sampleIngredientsData)
  });
});