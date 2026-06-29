import ingredientsReducer, {
  getIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
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
      image_mobile: 'image-mobile.png'
    },
    {
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
      image_mobile: 'image-mobile.png'
    }
  ];

  test('should return initial state with unknown action', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle getIngredients.pending', () => {
    const state = ingredientsReducer(initialState, getIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should handle getIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      getIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  test('should handle getIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      getIngredients.rejected(new Error(errorMessage), '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should select ingredients', () => {
    const state = {
      ingredients: { ...initialState, ingredients: mockIngredients }
    };
    expect(selectIngredients(state)).toEqual(mockIngredients);
  });

  test('should select isLoading', () => {
    const state = { ingredients: { ...initialState, isLoading: true } };
    expect(selectIngredientsLoading(state)).toBe(true);
  });

  test('should select error', () => {
    const error = 'Test error';
    const state = { ingredients: { ...initialState, error } };
    expect(selectIngredientsError(state)).toBe(error);
  });
});
