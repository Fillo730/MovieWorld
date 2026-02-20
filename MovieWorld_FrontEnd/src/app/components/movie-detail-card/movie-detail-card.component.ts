import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Movie } from '../../models/Movie.model';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'movie-detail-card-component',
  standalone: true,
  imports: [ButtonModule, InputNumberModule, FormsModule, CurrencyPipe],
  templateUrl: './movie-detail-card.component.html',
  styleUrl: './movie-detail-card.component.css',
})
export class MovieDetailCard implements OnChanges {

  @Input() movie!: Movie;
  @Input() watchTrailerLabel!: string;
  @Input() areCartServicesDisabled: boolean = false;
  @Input() goBackLabel!: string;
  @Input() addCartLabel!: string;
  @Input() removeCartLabel!: string;
  @Input() addToastText!: string;
  @Input() removeToastText!: string;
  @Input() quantity!: number;
  @Input() isLoading: boolean = false;

  internalQuantity: number = 1;
  internalLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router,
    private authService : AuthService
  ) {}

  ngOnChanges() {
    this.internalQuantity = (this.quantity && this.quantity > 0) ? this.quantity : 1;
  }

  handleGoToCatalog() {
    this.router.navigate(['/catalog']);
  }

  isInTheCart(): boolean {
    return this.cartService.isInTheCart(this.movie.movieId);
  }

  handleRemoveCart(): void {
    this.internalLoading = true;
    this.cartService.removeFromCart(this.movie.movieId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(this.removeToastText);
          this.internalQuantity = 1;
        }
        this.internalLoading = false;
      },
      error: () => {
        this.toastService.error("Errore durante la rimozione");
        this.internalLoading = false;
      }
    });
  }

  handleAddCart(): void {
    this.internalLoading = true;
    this.cartService.addToCart(this.movie, this.internalQuantity).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(this.addToastText);
        }
        this.internalLoading = false;
      },
      error: () => {
        this.toastService.error("Errore durante l'aggiunta");
        this.internalLoading = false;
      }
    });
  }

  handleOpenYoutubeTrailer(): void {
    if (this.movie.trailerUrl) {
      window.open(this.movie.trailerUrl, '_blank');
    }
  }

  handleQuantityMovieChanged(newQuantity: number): void {
    this.internalQuantity = newQuantity;
  }

  isLoggedIn() : boolean {
    return this.authService.isLoggedIn();
  }
}