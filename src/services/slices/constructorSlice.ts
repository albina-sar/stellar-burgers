import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Определяем тип напрямую, без импорта из utils-types
export interface TConstructorIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  id: string;
}

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      // Проверяем, что state.ingredients существует
      if (!state.ingredients) {
        state.ingredients = [];
      }

      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      if (!state.ingredients || state.ingredients.length === 0) return;
      const index = action.payload;
      if (index > 0 && index < state.ingredients.length) {
        const [item] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, item);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      if (!state.ingredients || state.ingredients.length === 0) return;
      const index = action.payload;
      if (index >= 0 && index < state.ingredients.length - 1) {
        const [item] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, item);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructor = (state: { constructor: ConstructorState }) =>
  state.constructor || { bun: null, ingredients: [] };

export default constructorSlice.reducer;
