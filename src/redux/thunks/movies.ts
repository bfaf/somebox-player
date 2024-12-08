import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMovies = createAsyncThunk(
  'movies/fetch',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await api.get('/list');
      return fulfillWithValue(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateMovieContinueTime = createAsyncThunk(
  'movies/updateMovieContinueTime',
  async ({movieId, seriesId, time} : { movieId: number, seriesId: number, time: number }, { fulfillWithValue, rejectWithValue }) => {
    try {
      if (seriesId) {
        await api.post(`/updateStartFrom/${movieId}?time=${time}&seriesId=${seriesId}`);
      } else {
        await api.post(`/updateStartFrom/${movieId}?time=${time}`);
      }
      return fulfillWithValue({movieId, seriesId, time});
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
