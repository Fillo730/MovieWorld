import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, finalize, switchMap, tap } from 'rxjs/operators';

import { Order, OrderState } from '../../models/Order.model';
import { UserService } from '../../services/user-service.server';
import { User } from '../../models/User.model';
import { MovieService } from '../../services/movie.service';
import { SellPointsService } from '../../services/sell-points.service';
import { LanguageService } from '../../services/language.service';
import { Movie } from '../../models/Movie.model';
import { SellPoint } from '../../models/SellPoint.model';

@Component({
  selector: 'update-create-order-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './update-create-order.component.html',
  styleUrl: './update-create-order.component.css',
})
export class UpdateCreateOrderComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly movieService = inject(MovieService);
  private readonly sellPointsService = inject(SellPointsService);
  private readonly languageService = inject(LanguageService);
  
  public orderUpdate!: Order;
  public isLoading = false;
  public states: OrderState[] = [];

  userSearch = new FormControl<any>('');
  movieSearch = new FormControl<any>('');
  sellPointSearch = new FormControl<any>('');

  public lang = this.languageService.currentLanguage;
  usersQuered: User[] = [];
  moviesQuered: Movie[] = [];
  sellPointsQuered: SellPoint[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateCreateOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.states = this.data.states || [];
    console.log(this.data.order);

    this.orderUpdate = { 
      ...this.data.order,
      items: this.data.order.items ? this.data.order.items.map((i: any) => ({ ...i, movie: { ...i.movie } })) : [],
      sellPoint: this.data.order.sellPoint ? { ...this.data.order.sellPoint } : null,
      user: this.data.order.user ? { ...this.data.order.user } : null,
      state: this.data.order.state ? {...this.data.order.state} : null
    };

    if (this.orderUpdate.user) {
      this.userSearch.setValue(this.orderUpdate.user, { emitEvent: false });
    }
    if (this.orderUpdate.sellPoint) {
      this.sellPointSearch.setValue(this.orderUpdate.sellPoint, { emitEvent: false });
    }

    this.userSearch.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.userService.getUsersByQuery(8, query).pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.usersQuered = res.data;
    });

    this.movieSearch.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.movieService.getMoviesByQuery(8, query).pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.moviesQuered = res.data;
    });

    this.sellPointSearch.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.sellPointsService.getSellPointsByQuery(8, query).pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.sellPointsQuered = res.data;
    });

    this.calculateTotal();
  }

  displayUserFn(user: any): string {
    return user && user.name ? `${user.name} ${user.surname}` : '';
  }

  displaySellPointFn(sp: any): string {
    return sp && sp.name ? `${sp.name} (${sp.city})` : '';
  }

  displayMovieFn(): string {
    return '';
  }

  onUserSelected(event: any): void {
    this.orderUpdate.user = event.option.value;
  }

  onSellPointSelected(event: any): void {
    this.orderUpdate.sellPoint = event.option.value;
  }

  onMovieSelected(event: any): void {
    this.addMovie(event.option.value);
    this.movieSearch.setValue('', { emitEvent: false });
  }

  addMovie(movie: Movie): void {
    const movieId = movie.movieId;
    const existingItem = this.orderUpdate.items.find((i: any) => i.movie.movieId === movieId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderUpdate.items.push({ movie: { ...movie }, quantity: 1, price: movie.cost});
    }
    this.calculateTotal();
  }

  removeItem(index: number): void {
    this.orderUpdate.items.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal(): void {
    const total = this.orderUpdate.items.reduce((acc: number, item: any) => {
      const price = item.movie.cost || item.movie.price || 0;
      return acc + (price * item.quantity);
    }, 0);
    this.orderUpdate.totalAmount = parseFloat(total.toFixed(2));
  }

  onSave(): void {
    this.dialogRef.close(this.orderUpdate);
  }

  compareStates(o1 : any, o2 : any) : boolean {
    return o1 && o2 ? o1.id == o2.id : o1 === o2;
  }
}