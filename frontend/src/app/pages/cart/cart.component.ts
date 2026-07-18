//Angular
import { Component, OnInit, inject, computed, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNG & UI
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';

//Services
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { SellPointsService } from '../../services/sell-points.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

//Models & Utils
import { Movie } from '../../models/Movie.model';
import { SellPoint } from '../../models/SellPoint.model';
import { UserCreateOrderRequest } from '../../models/UserCreateOrderRequest.model';
import { getLatLngUser } from '../../utils/findDidstanceMaps';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

//Components
import { SellPointsListComponent } from '../../components/sell-points-list/sell-points-list.component';
import { Footer } from '../../components/footer/footer.component';
import { Header } from '../../components/header/header.component';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    Header, Footer, SellPointsListComponent, ButtonModule, ListboxModule,
    FormsModule, CartItemComponent, CurrencyPipe, TranslatePipe, StateHandlerComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class Cart implements OnInit {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  public readonly cartService = inject(CartService);
  private readonly sellPointsService = inject(SellPointsService);
  private readonly themeService = inject(ThemeService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  public readonly languageService = inject(LanguageService);

  sellPoints = signal<SellPoint[]>([]);
  totalRecords = signal(0);
  isLoading = signal(true);
  error = signal(false);
  distanceCalculationLoading = signal(false);
  
  rows = 6;
  first = 0;
  public lastLat?: number;
  private lastLng?: number;

  selectedSellPoint!: SellPoint;
  private preferredSellPointApplied = false;

  public readonly moviesInTheCart = computed(() => 
    this.cartService.cart()?.items.map(item => ({
      ...item, 
      price: item.movie.cost ?? 0
    })) ?? []
  );

  public readonly moviesIds = computed<number[]>(() => {
    return this.moviesInTheCart().map(item => item.movie.movieId);
  });

  public readonly cartTotal = this.cartService.totalPrice;

  constructor() {
    effect(() => {
      if (this.cartService.isEmpty() && this.router.url === '/cart') {
        this.goToCatalog();
      }
    });
  }

  ngOnInit() {
    this.loadSellPoints();
  }

  loadSellPoints(userLat?: number, userLng?: number) {
    if (userLat !== undefined && userLng !== undefined) {
      this.lastLat = userLat;
      this.lastLng = userLng;
    }

    this.isLoading.set(true);
    const pageIndex = Math.floor(this.first / this.rows);

    this.sellPointsService.getSellPointsByMovies(
      pageIndex, this.rows, this.moviesIds(), this.lastLat, this.lastLng
    ).subscribe({
      next: (response) => {
        this.sellPoints.set(response.data.items);
        this.totalRecords.set(response.data.totalCount);
        this.error.set(false);
        this.isLoading.set(false);
        this.distanceCalculationLoading.set(false);
        this.applyPreferredSellPoint();
      },
      error: () => {
        this.error.set(true);
        this.isLoading.set(false);
        this.distanceCalculationLoading.set(false);
      }
    });
  }

  handleOrderByDistance() {
    this.distanceCalculationLoading.set(true);
    getLatLngUser()
      .then(pos => {
        this.first = 0;
        this.loadSellPoints(pos.lat, pos.lng);
      })
      .catch(() => {
        this.toastService.error(this.translate.instant('Cart.LocationError'));
        this.distanceCalculationLoading.set(false);
      });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadSellPoints();
  }

  handleClearCart() {
    this.cartService.clearCart().subscribe(res => {
      if (res.success) {
        this.toastService.success(this.translate.instant('Cart.ToastCartEmpty'));
        this.goToCatalog();
      }
    });
  }

  handleCompleteOrder() {
    if (!this.selectedSellPoint) return;

    const request: UserCreateOrderRequest = {
      orderStateId: 1,
      sellPointId: this.selectedSellPoint.id,
      items: this.moviesInTheCart()
    };

    this.cartService.addUserOrder(request).subscribe(res => {
      if (res.success) {
        this.cartService.clearCart().subscribe(() => {
          this.toastService.success(this.translate.instant('Cart.ToastOrderCompleted'));
          this.goToCatalog();
        });
      } else {
        this.toastService.error(this.translate.instant('Cart.ErrorAddCart'));
      }
    });
  }

  handleRemove(movie: Movie) {
    this.cartService.removeFromCart(movie.movieId).subscribe(res => {
      if (res.success) {
        this.toastService.success(this.translate.instant('Cart.ToastItemRemoved'));
        this.loadSellPoints(); 
      }
    });
  }

  goToCatalog() : void {
    this.router.navigate(['/catalog']);
  }

  handleClickedSellPoint(sellPoint: SellPoint) {
    this.selectedSellPoint = sellPoint;
  }

  private applyPreferredSellPoint(): void {
    if (this.preferredSellPointApplied || this.selectedSellPoint) return;

    const preferredId = this.authService.preferredSellPointId();
    if (!preferredId) return;

    const match = this.sellPoints().find(sp => sp.id === preferredId);
    if (match) {
      this.selectedSellPoint = match;
    }

    this.preferredSellPointApplied = true;
  }

  get buttonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}