import { createSlice } from "@reduxjs/toolkit";

// Initial state for editButton
const initialState = {
  image: null,
  prompt: '',
};

// Edit button slice
const editButtonSlice = createSlice({
  name: 'editButton',
  initialState,
  reducers: {
    startEditing(state, action) {
      state.image = action.payload.image; // Set the image
      state.prompt = action.payload.prompt; // Set the prompt
    },
    stopEditing(state) {
      state.image = null;
      state.prompt = '';
    },
  },
});

export const { startEditing, stopEditing } = editButtonSlice.actions; // Export the actions

export default editButtonSlice.reducer;
