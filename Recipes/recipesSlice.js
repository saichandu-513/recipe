import { createSlice } from '@reduxjs/toolkit';
import { recipes as dummyData } from './recipes';

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    all: dummyData,
    favorites: [],
    filters: {
      type: 'all',
      query: '',
    },
    selectedRecipe: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(fav => fav !== id);
      } else {
        state.favorites.push(id);
      }
    },
    setFilterType: (state, action) => {
      state.filters.type = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.query = action.payload;
    },
    addRecipe: (state, action) => {
      const newRecipe = action.payload;
      newRecipe.id = Date.now();
      state.all.push(newRecipe);
    },
    selectRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    // In recipesSlice.js, add this to the reducers object
editRecipe: (state, action) => {
  const { id, updatedRecipe } = action.payload;
  const index = state.all.findIndex(recipe => recipe.id === id);
  if (index !== -1) {
    state.all[index] = { ...state.all[index], ...updatedRecipe };
  }
},
  },
});

export const { toggleFavorite, setFilterType, setSearchQuery, addRecipe, selectRecipe, clearSelectedRecipe,editRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
