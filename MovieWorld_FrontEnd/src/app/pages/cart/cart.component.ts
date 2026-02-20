import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { SellPointsListComponent } from '../../components/sell-points-list/sell-points-list.component';
import { Footer } from '../../components/footer/footer.component';
import { Header } from '../../components/header/header.component';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth-service.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { Movie } from '../../models/Movie.model';
import { SellPoint } from '../../models/SellPoint.model';
import { getLatLngUser } from '../../utils/findDidstanceMaps';
import { LanguageService } from '../../services/language.service';
import { SellPointsService } from '../../services/sell-points.service';
import { Order, OrderItem } from '../../models/Order.model';
import { OrdersService } from '../../services/orders.service';
import { UserCreateOrderRequest } from '../../models/UserCreateOrderRequest.model';
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
export class Cart implements OnInit, OnDestroy {
  sellPoints: SellPoint[] = [];
  total: number = 0;
  selectedSellPoint!: SellPoint;
  moviesInTheCart: OrderItem[] = [];
  areSellPointsOrdered: boolean = false;
  totalRecords: number = 0;
  rows: number = 6;
  first: number = 0;
  lang !: string;

  isLoading: boolean = true;
  error: boolean = false;
  distanceCalculationLoading: boolean = false;
  
  private lastLat?: number;
  private lastLng?: number;
  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private authService: AuthService,
    private languageService: LanguageService,
    private sellPointsService: SellPointsService
  ) {}

  ngOnInit() {
    this.lang = this.languageService.getLanguage();
    this.initCart();
  }

  initCart() {
    this.isLoading = true;
    this.error = false;
    
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (cart) => {
        if (cart) {
          this.moviesInTheCart = cart.items.map(item => ({...item, price: item.movie.cost ?? 0})) as OrderItem[];
          this.total = cart.totalPrice ?? 0;
          
          if (cart.items.length === 0 && this.router.url === '/cart') {
            this.router.navigate(['/catalog']);
            return;
          }

          if (cart.items.length > 0) {
            this.loadSellPoints();
          } else {
            this.isLoading = false;
          }
        }
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  loadSellPoints(userLat?: number, userLng?: number) {
    if (userLat !== undefined && userLng !== undefined) {
      this.lastLat = userLat;
      this.lastLng = userLng;
      this.areSellPointsOrdered = true;
    }

    const movieIds = this.cartService.getMovieIds();
    const pageIndex = Math.floor(this.first / this.rows);

    this.sellPointsService.getSellPointsByMovies(
      pageIndex, this.rows, this.lang, movieIds, this.lastLat, this.lastLng
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.sellPoints = response.data.items;
          this.totalRecords = response.data.totalCount;
          this.error = false;
        } else {
          this.error = true;
        }
        this.isLoading = false;
        this.distanceCalculationLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
        this.distanceCalculationLoading = false;
      }
    });
  }

  handleOrderByDistance() {
    this.distanceCalculationLoading = true;
    getLatLngUser()
      .then(pos => {
        this.first = 0;
        this.loadSellPoints(pos.lat, pos.lng);
      })
      .catch(() => {
        this.toastService.error(this.translate.instant('Cart.LocationError'));
        this.distanceCalculationLoading = false;
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
        this.router.navigate(['/catalog']);
      }
    });
  }

  handleCompleteOrder() {
    const request: UserCreateOrderRequest = {
      orderStateId: 1,
      sellPointId: this.selectedSellPoint.id,
      items: this.moviesInTheCart
    };

    this.cartService.addUserOrder(request, this.lang).subscribe(res => {
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
      }
    });
  }

  goToCatalog() : void {
    this.router.navigate(['/catalog']);
  }

  handleClickedSellPoint(sellPoint: SellPoint) {
    this.selectedSellPoint = sellPoint;
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }

  getUserName() {
    return this.authService.getUserName();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}