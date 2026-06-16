import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const getOrderByNumber = createAsyncThunk(
  'orderInfo/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

interface OrderInfoState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderInfoState = {
  order: null,
  isLoading: false,
  error: null
};

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;

export const selectOrderInfo = (state: { orderInfo: OrderInfoState }) =>
  state.orderInfo;

export default orderInfoSlice.reducer;
