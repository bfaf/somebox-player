import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMovies = createAsyncThunk(
  'movies/fetch',
  async (_, {fulfillWithValue, rejectWithValue}) => {
    try {
      const res = await api.get('/list');
      return fulfillWithValue(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
