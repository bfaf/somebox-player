import { createSelector, createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AxiosError } from 'axios';
import { MovieData } from '../../constants';
import { fetchMovies, updateMovieContinueTime } from '../thunks/movies';

interface MoviesState {
  movies?: MovieData[];
  isLoading: boolean;
  isLoaded: boolean;
  error?: unknown;
}

const initialState: MoviesState = {
  movies: undefined,
  isLoading: true,
  isLoaded: false,
  error: undefined,
};

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    resetMoviesState: () => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        return {
          ...state,
          movies: action.payload,
          error: undefined,
          isLoading: false,
          isLoaded: true,
        };
      })
      .addCase(fetchMovies.pending, state => {
        return {
          ...state,
          movies: undefined,
          error: undefined,
          isLoading: true,
        };
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        const error = action.payload as AxiosError;
        return {
          ...state,
          movies: undefined,
          isLoading: false,
          error: error.message,
        };
      })
      .addCase(updateMovieContinueTime.fulfilled, (state, action) => {
        const {movieId, seriesId, time} = action.payload;
        if (state.movies) {
          const movies: MovieData[] = current(state.movies);
          const movie = movies.find(m => m.movieId === movieId);
          const idx = movies.findIndex(m => m.movieId === movieId);
          const newMovie = {
            ...movie,
            moviesContinue: {
              ...movie?.moviesContinue,
              seriesId,
              startFrom: time,
            },
          };
          const newMovies: MovieData[] = (movies || []).filter(mov => mov.movieId !== movieId);
          // @ts-ignore
          newMovies.splice(idx, 0, newMovie);
          return {
            ...state,
            movies: newMovies,
            error: undefined,
            isLoading: false,
            isLoaded: true,
          };
        }
      });
  },
});

export const { resetMoviesState } = moviesSlice.actions;
export const selectMovies = (state: RootState) => state.movies.movies;
export const selectIsLoadingMovies = (state: RootState) =>
  state.movies.isLoading;
export const selectIsLoadedMovies = (state: RootState) => state.movies.isLoaded;
export const selectErrorMovies = (state: RootState) => state.movies.error;
const selectMovieId = (_state: RootState, movieId: number) => movieId;
export const selectMovieById = createSelector(
  [selectMovies, selectMovieId],
  (movies, movieId) => (movies || []).find(movie => movie.movieId === movieId),
);

export default moviesSlice.reducer;
