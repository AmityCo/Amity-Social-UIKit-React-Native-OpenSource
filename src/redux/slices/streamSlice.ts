import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    updateCurrentStream: (state, action: PayloadAction<Amity.Stream>) => {
      state.data = { ...action.payload };
    },
  },
});

export default streamSlice;
