import { createSlice } from '@reduxjs/toolkit';

// Initial state for language
const initialState = {
  language: 'en', // default language
};

// Language slice
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload; // Set the language
    },
  },
});

export const { setLanguage } = languageSlice.actions; // Export the action
export default languageSlice.reducer;
