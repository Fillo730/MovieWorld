//Angular
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";

//Components
import { Header } from "../../components/header/header.component";
import { Footer } from "../../components/footer/footer.component";
import { OrderUserListComponent } from "../../components/order-user-list/order-user-list.component";
import { StateHandlerComponent } from "../../components/state-handler/state-handler.component";
import { YourOrdersFiltersComponent } from "../../components/your-orders-filters/your-orders-filters.component";
import { OrderUserDetailDialogComponent } from "../../components/order-user-detail-dialog/order-user-detail-dialog.component";

//Services
import { OrdersService } from "../../services/orders.service";
import { LanguageService } from "../../services/language.service";
import { AuthService } from "../../services/auth.service";
import { ThemeService } from "../../services/theme.service";

//Models
import { DEFAULT_ORDERS_FILTER, OrdersFilter } from "../../models/filters/OrdersFilter.model";
import { Order, OrderState } from "../../models/Order.model";
import { TranslatePipe } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { getButtonTypeBasedOnTheme } from "../../utils/themeFunctions";
import { finalize } from "rxjs";

@Component({
  selector: 'your-orders-page',
  standalone: true,
  imports: [
    Header,
    Footer,
    OrderUserListComponent,
    TranslatePipe,
    StateHandlerComponent,
    YourOrdersFiltersComponent,
    OrderUserDetailDialogComponent,
    ButtonModule
  ],
  templateUrl: './your-orders.html',
  styleUrl: './your-orders.css',
})

export class YourOrders {
  private ordersService = inject(OrdersService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public orders = signal<Order[]>([]);
  public readonly lang = this.languageService.currentLanguage;
  public isLoading = signal<boolean>(false);
  public error = signal<boolean>(false);
  public hasLoadedOnce = signal<boolean>(false);

  public first = signal<number>(0)
  public rows = signal<number>(10);
  public readonly totalRecords = signal<number>(0);

  public filters = signal<OrdersFilter>({ ...DEFAULT_ORDERS_FILTER });
  public orderStates = signal<OrderState[]>([]);

  public selectedOrder = signal<Order | null>(null);
  public isDetailVisible = signal<boolean>(false);

  public readonly pageIndex = computed(() => Math.floor(this.first() / this.rows()));

  constructor() {
    this.loadOrderStates();

    effect(() => {
      this.lang();
      this.first();
      this.rows();
      this.filters();
      this.loadOrders();
    })
  }

  loadOrders() {

    this.isLoading.set(true);
    this.error.set(false);

    this.ordersService.getUsersOrders(this.pageIndex(), this.rows(), this.filters()).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.hasLoadedOnce.set(true);
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.orders.set(response.data.items);
          this.totalRecords.set(response.data.totalCount);
        } else {
          this.error.set(true);
        }
      },
      error: () => {
        this.error.set(true);
      }
    });
  }

  loadOrderStates() {
    this.ordersService.getOrderStates().subscribe(response => {
      if (response.success) {
        this.orderStates.set(response.data);
      }
    });
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  applyFilters(newFilters: OrdersFilter) {
    this.first.set(0);
    this.filters.set(newFilters);
  }

  handleFiltersReset() {
    this.first.set(0);
    this.filters.set({ ...DEFAULT_ORDERS_FILTER });
  }

  handleViewDetails(order: Order) {
    this.selectedOrder.set(order);
    this.isDetailVisible.set(true);
  }

  closeDetails() {
    this.isDetailVisible.set(false);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
