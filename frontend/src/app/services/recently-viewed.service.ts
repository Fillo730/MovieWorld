//Angular
import { Injectable, signal } from '@angular/core';

//Models
import { Movie } from '../models/Movie.model';
import { RecentlyViewedItem } from '../models/RecentlyViewedItem.model';

const STORAGE_KEY = 'recently_viewed_movies';
const MAX_ITEMS = 10;

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private readonly _items = signal<RecentlyViewedItem[]>(this.loadFromStorage());

  public readonly items = this._items.asReadonly();

  public addMovie(movie: Movie): void {
    const withoutCurrent = this._items().filter(i => i.movieId !== movie.movieId);

    const updated: RecentlyViewedItem[] = [
      { movieId: movie.movieId, title: movie.title, imagePath: movie.imagePath, viewedAt: Date.now() },
      ...withoutCurrent,
    ].slice(0, MAX_ITEMS);

    this._items.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  private loadFromStorage(): RecentlyViewedItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
