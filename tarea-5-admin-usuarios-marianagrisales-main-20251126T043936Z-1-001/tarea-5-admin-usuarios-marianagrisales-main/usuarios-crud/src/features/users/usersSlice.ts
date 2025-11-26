import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import api from '../../api/axiosInstance';

// Async thunks
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User[]>('/users');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error fetching users');
    }
  }
);

export const createUser = createAsyncThunk<User, Omit<User, 'id'>>(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<User>('/users', payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error creating user');
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: number; changes: Partial<User> }>(
  'users/updateUser',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put<User>(`/users/${id}`, changes);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error updating user');
    }
  }
);

export const deleteUser = createAsyncThunk<number, number>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error deleting user');
    }
  }
);

// Slice state
interface UsersState {
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = { list: [], status: 'idle', error: null };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUserToState(state, action: PayloadAction<User>) {
      state.list.push(action.payload);
    },
    updateUserInState(state, action: PayloadAction<User>) {
      const idx = state.list.findIndex(u => u.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    removeUserFromState(state, action: PayloadAction<number>) {
      state.list = state.list.filter(u => u.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = (action.payload as string) || action.error.message || 'Fetch failed'; })

      // createUser
      .addCase(createUser.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(createUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.list.push(action.payload); })
      .addCase(createUser.rejected, (state, action) => { state.status = 'failed'; state.error = (action.payload as string) || action.error.message || 'Create failed'; })

      // updateUser
      .addCase(updateUser.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idx = state.list.findIndex(u => u.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.status = 'failed'; state.error = (action.payload as string) || action.error.message || 'Update failed'; })

      // deleteUser
      .addCase(deleteUser.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(deleteUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = state.list.filter(u => u.id !== action.payload); })
      .addCase(deleteUser.rejected, (state, action) => { state.status = 'failed'; state.error = (action.payload as string) || action.error.message || 'Delete failed'; });
  }
});

export const { addUserToState, updateUserInState, removeUserFromState } = usersSlice.actions;
export default usersSlice.reducer;