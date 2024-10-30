export interface SomeBoxFileInfo {
    id: number;
    filename: string;
    originalFilename: string;
    screenshotName: string;
    duration: number;
    readableDuration: string; // format 'HH:MM:SS'
    resumeFromTime: number;
};

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
}

export type MovieData = {
    movieId: number;
    name: string;
    releaseYear: string;
    filename: string;
    startFrom: number;
    published: number;
    createdAt: string;
    updatedAt: string;
    moviesMetadataEntity: MoviesMetadataEntity;
};
