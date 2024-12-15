export type MoviesMetadataEntity = {
  moviesMetadataId: number;
  movieId: number;
  plot: string;
  rating: string;
  duration: number;
  poster: string;
  format: string;
  rated: string;
  ganre: string;
  skipIntroAt: number;
  skipIntroDuration: number;
  skipCreditsAt: number;
  columnInfo?: string;
  playCount: number;
};

export type MovieData = {
  movieId: number;
  name: string;
  releaseYear: string;
  filename: string;
  moviesContinue?: MoviesContinue;
  moviesSeries?: MoviesSeries[];
  published: number;
  createdAt: string;
  updatedAt: string;
  moviesMetadataEntity: MoviesMetadataEntity;
};

export type MoviesContinue = {
  id: number;
  movieId: number;
  seriesId: number;
  startFrom: number;
  createdAt: string;
  updatedAt: string;
}

export type MoviesSeries = {
  id: number;
  movieId: number;
  filename: string;
  creditsTime: number;
  introTime: number;
  skipIntroSeconds: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
};
