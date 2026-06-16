import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const getOrders = createAsyncThunk('orders/getOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const selectOrders = (state: { orders: OrdersState }) =>
  state.orders.orders;
export const selectOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.isLoading;

export default ordersSlice.reducer;
