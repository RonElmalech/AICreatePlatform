import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import editButtonReducer from './editButtonSlice';

// Redux store
const store = configureStore({
  reducer: {
    language: languageReducer,
    editButton: editButtonReducer,
  },
});

export default store;
