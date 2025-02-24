import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ck: null,
  sk: null,
  transactionStatus: null,
  callSession: null,
};

const acsSlice = createSlice({
  name: 'acs',
  initialState,
  reducers: {
    setSession(state, action) {
      state.ck = action.payload.ck;
      state.sk = action.payload.sk;
    },
    setTransactionStatus(state, action) {
      state.transactionStatus = action.payload;
    },
    setCallSession(state, action) {
      state.callSession = action.payload;
    },
  },
});

export const { setSession, setTransactionStatus, setCallSession } = acsSlice.actions;
export default acsSlice.reducer;