import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { scrollToTop } from '../../utils/windowFunctions';
import { Movie } from '../../models/Movie.model';
import { CartItem } from '../../models/CartItem.model';

@Component({
  selector: 'movies-list-component',
  standalone: true,
  imports: [MovieCardComponent, PaginatorModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css',
})
export class MoviesListComponent {
  @Input() movies: Movie[] = [];
  @Input() discoverLabel!: string;
  @Input() addLabel!: string;
  @Input() removeLabel!: string;
  @Input() toastAddLabel!: string;
  @Input() toastRemoveLabel!: string;
  
  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;
  @Input() first: number = 0;

  @Input() castServicesVisible: boolean = true;
  @Input() cartServicesDisabled = false;
  @Input() modifyButtonLabel: string = "";
  @Input() deleteButtonLabel: string = "";
  @Input() showMoviesNotCentered : boolean = false;

  @Output() onDeleteMovie = new EventEmitter<number>();
  @Output() onEditMovie = new EventEmitter<number>();
  @Output() onPageChange = new EventEmitter<any>();

  loadingMovieId: number | null = null;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  isMovieInTheCart(movie: Movie): boolean {
    return this.cartService.isInTheCart(movie.movieId);
  }

  findQuantityMovie(movie: Movie): number {
    return this.cartService.getQuantityForMovie(movie.movieId);
  }

  toggleIsInTheCart(cartItem: CartItem): void {
    this.loadingMovieId = cartItem.movie.movieId;
    const movieId = cartItem.movie.movieId;


    if (this.cartService.isInTheCart(movieId)) {
      this.cartService.removeFromCart(movieId).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success(this.toastRemoveLabel);
          } else {
            this.toastService.error(res.message);
          }
          this.loadingMovieId = null;
        },
        error: () => {
          this.toastService.error("Errore di connessione");
          this.loadingMovieId = null;
        }
      });
    } else {
      this.cartService.addToCart(cartItem.movie, cartItem.quantity || 1).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success(this.toastAddLabel);
          } else {
            this.toastService.error(res.message);
          }
          this.loadingMovieId = null;
        },
        error: () => {
          this.toastService.error("Errore di connessione");
          this.loadingMovieId = null;
        }
      });
    }
  }

  handlePageChange(event: any): void {
    this.onPageChange.emit(event);
    scrollToTop();
  }

  handleDeleteMovie(movieId: number): void {
    this.onDeleteMovie.emit(movieId);
  }

  handleEditMovie(movieId: number): void {
    this.onEditMovie.emit(movieId);
  }
}