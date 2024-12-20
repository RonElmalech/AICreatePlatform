
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: null,
  prompt: '',
};

const editButtonSlice = createSlice({
  name: 'editButton',
  initialState,
  reducers: {
    startEditing(state, action) {
      state.image = action.payload.image;
      state.prompt = action.payload.prompt;
    },
    stopEditing(state) {
      state.image = null;
      state.prompt = '';
    },
  },
});

export const { startEditing, stopEditing } = editButtonSlice.actions;

export default editButtonSlice.reducer;
