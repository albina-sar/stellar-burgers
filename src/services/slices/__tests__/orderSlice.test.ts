import orderReducer, { clearOrder, selectOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const initialState = {
    order: null,
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '123',
    status: 'done',
    name: 'Test Burger',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12345,
    ingredients: ['1', '2']
  };

  it('should return initial state with unknown action', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('should handle clearOrder', () => {
    const stateWithOrder = {
      order: mockOrder,
      isLoading: false,
      error: null
    };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state).toEqual(initialState);
  });

  it('should select order', () => {
    const state = {
      order: { order: mockOrder, isLoading: false, error: null }
    };
    expect(selectOrder(state)).toEqual({
      order: mockOrder,
      isLoading: false,
      error: null
    });
  });
});
