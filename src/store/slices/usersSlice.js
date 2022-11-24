import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from '../thunks/fetchUsers';
import { addUser } from '../thunks/addUser';
import { removeUser } from '../thunks/removeUser';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    isLoading: false,
    data: [],
    error: null,
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(addUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data.push(action.payload);
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(removeUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = state.data.filter((user) => {
        return user.id !== action.payload.id;
      });
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
  // Vise se ne koriste Async Thunks vec RTK Query
  // Kada se okine akcija iz Async Thunks, pokrece se standardan proces dispathing-a trenutne akcije, pri cemu postoje
  // dodatni atributi koji odredjuju da li se akcija trenutno izvrsava ili je zavrsena (uspesno/neuspesno)
  // extraReducers(builder) {
  //   // fetchUsers treba da bude custom thunk koji se koristi za asinhroni poziv API-u
  //
  //   // pending - izvrsava se request
  //   builder.addCase(fetchUsers.pending, (state, action) => {
  //     state.isLoading = true;
  //   });
  //   // fulfilled - request je uspesno izvrsen i stigli su podaci
  //   builder.addCase(fetchUsers.fulfilled, (state, action) => {
  //     state.isLoading = false;
  //     state.data = action.payload;
  //   });
  //   // rejected - desila se greska
  //   builder.addCase(fetchUsers.rejected, (state, action) => {
  //     state.isLoading = false;
  //     state.error = action.error;
  //   });
  // }
});

export const usersReducer = usersSlice.reducer;
