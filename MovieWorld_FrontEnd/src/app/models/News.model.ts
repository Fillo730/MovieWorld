import { Person } from "./Person.model"
import { Movie } from "./Movie.model"

export interface News {
    id: number,
    title: string,
    text: string,
    imagePath: string,
    date: string,
    relatedMovies: Movie[],
    relatedActors: Person[]
}