import { Router } from "@angular/router";
import { Movie } from "../models/Movie.model";
import { scrollToTop } from "./windowFunctions";

export function goToMovieDetail(movie : Movie, router : Router) {
    router.navigate(['movie-detail', movie.movieId]);
    scrollToTop();
}