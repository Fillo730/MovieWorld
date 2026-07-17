import { Person } from "./Person.model";
import { Genre } from "./Genre.model";
import { Format } from "./Format.model";

export interface Movie {
    movieId: number;
    title: string;
    story: string;
    cost: number;
    year: number;
    genres: Genre[],
    format: Format,
    imagePath: string | null;
    trailerUrl: string;
    isCult: boolean;
    director: Person | null;
    actors: Person[];
}