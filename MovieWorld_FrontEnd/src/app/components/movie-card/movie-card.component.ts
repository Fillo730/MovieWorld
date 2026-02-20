import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { goToMovieDetail } from '../../utils/navigationFunctions';
import { ThemeService } from '../../services/theme.service';
import { Movie } from '../../models/Movie.model';
import { CartItem } from '../../models/CartItem.model';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'movie-card-component',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, InputNumberModule, FormsModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isInTheCart: boolean = false;
  @Input() discoverLabel!: string;
  @Input() addLabel!: string;
  @Input() removeLabel!: string;
  @Input() quantity: number = 1;

  @Input() cartServicesVisible = true;
  @Input() cartServicesDisabled = false;
  @Input() modifyButtonLabel : string = "";
  @Input() deleteButtonLabel : string = "";

  @Input() isLoading : boolean = false;

  @Output() toggleInTheCart = new EventEmitter<CartItem>();
  @Output() deleteMovie = new EventEmitter<number>();
  @Output() editMovie = new EventEmitter<number>();

  constructor(private router: Router, private themeService : ThemeService, private authService : AuthService) {}

  ngOnInit() {
    console.log(this.isInTheCart)
  }

  handleToggleToTheCart(): void {
    this.toggleInTheCart.emit({
      movie: this.movie,
      quantity: this.quantity,
    });
  }

  handleDeleteMovie() : void {
    this.deleteMovie.emit(this.movie.movieId);
  }

  handleEditMovie() : void {
    this.editMovie.emit(this.movie.movieId);
  }

  openDetail() {
    goToMovieDetail(this.movie, this.router);
  }

  isLoggedIn() : boolean {
    return this.authService.isLoggedIn();
  }

  isDark() : boolean {
    return this.themeService.isDark();
  }
}