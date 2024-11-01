import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { AxiosError } from 'axios';
import { MovieData } from '../../constants';
import { fetchMovies } from '../thunks/movies';

interface MoviesState {
    movies?: MovieData[];
    isLoading: boolean;
    isLoaded: boolean;
    error?: unknown,
}

const initialState: MoviesState = {
    movies: undefined,
    isLoading: true,
    isLoaded: false,
    error: undefined,
}

export const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        resetMoviesState: () => {
            return {
                ...initialState
            };
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMovies.fulfilled, (state, action) => {
            return {
                ...state,
                movies: action.payload,
                error: undefined,
                isLoading: false,
                isLoaded: true,
            }
        })
        .addCase(fetchMovies.pending, (state, action) => {
            return {
                ...state,
                movies: undefined,
                error: undefined,
                isLoading: true,
            }
        })
        .addCase(fetchMovies.rejected, (state, action) => {
            const error = (action.payload as AxiosError);
            return {
                ...state,
                movies: undefined,
                isLoading: false,
                error: error.message,
            }
        })
    }
  });

export const { resetMoviesState } = moviesSlice.actions;
export const selectMovies = (state: RootState) => state.movies.movies;
export const selectIsLoadingMovies = (state: RootState) => state.movies.isLoading;
export const selectIsLoadedMovies = (state: RootState) => state.movies.isLoaded;
export const selectErrorMovies = (state: RootState) => state.movies.error;

export default moviesSlice.reducer;