import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  status: string;
}

const initialState: PaymentState = {
  status: 'idle',
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
