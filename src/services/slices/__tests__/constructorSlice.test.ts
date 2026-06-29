import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  selectConstructor
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TConstructorIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png',
    id: 'bun-1'
  };

  const mockIngredient: TConstructorIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 15,
    fat: 10,
    carbohydrates: 20,
    calories: 300,
    price: 150,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png',
    id: 'ing-1'
  };

  const mockIngredient2: TConstructorIngredient = {
    _id: '3',
    name: 'Начинка 2',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 25,
    calories: 350,
    price: 200,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png',
    id: 'ing-2'
  };

  test('should return initial state with unknown action', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle addIngredient for bun', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('should handle addIngredient for ingredient', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.bun).toBe(null);
    expect(state.ingredients).toContainEqual(mockIngredient);
  });

  test('should handle removeIngredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient]
    };
    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient(mockIngredient.id)
    );
    expect(state.ingredients).toEqual([]);
  });

  test('should handle moveIngredientUp', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = constructorReducer(stateWithIngredients, moveIngredientUp(1));
    expect(state.ingredients[0]).toEqual(mockIngredient2);
    expect(state.ingredients[1]).toEqual(mockIngredient);
  });

  test('should handle moveIngredientDown', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredientDown(0)
    );
    expect(state.ingredients[0]).toEqual(mockIngredient2);
    expect(state.ingredients[1]).toEqual(mockIngredient);
  });

  test('should handle clearConstructor', () => {
    const stateWithItems = {
      bun: mockBun,
      ingredients: [mockIngredient]
    };
    const state = constructorReducer(stateWithItems, clearConstructor());
    expect(state).toEqual(initialState);
  });

  test('should select constructor', () => {
    const state = {
      burgerConstructor: { bun: mockBun, ingredients: [mockIngredient] }
    };
    expect(selectConstructor(state)).toEqual({
      bun: mockBun,
      ingredients: [mockIngredient]
    });
  });
});
