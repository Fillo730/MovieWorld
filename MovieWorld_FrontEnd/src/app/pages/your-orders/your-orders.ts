//Angular
import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";

//Components
import { Header } from "../../components/header/header.component";
import { Footer } from "../../components/footer/footer.component";
import { OrderUserListComponent } from "../../components/order-user-list/order-user-list.component";
import { StateHandlerComponent } from "../../components/state-handler/state-handler.component";

//Services
import { OrdersService } from "../../services/orders.service";
import { LanguageService } from "../../services/language.service";
import { AuthService } from "../../services/auth-service.service";
import { ThemeService } from "../../services/theme.service";

//Models
import { DEFAULT_ORDERS_FILTER } from "../../models/filters/OrdersFilter.model";
import { Order } from "../../models/Order.model";
import { TranslatePipe } from "@ngx-translate/core";
import { getButtonTypeBasedOnTheme } from "../../utils/themeFunctions";
import { finalize } from "rxjs";

@Component({
  selector: 'your-orders-page',
  standalone: true,
  imports: [Header, Footer, OrderUserListComponent, TranslatePipe, StateHandlerComponent],
  templateUrl: './your-orders.html',
  styleUrl: './your-orders.css',
})

export class YourOrders {
  private ordersService = inject(OrdersService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  public orders = signal<Order[]>([]);
  public readonly lang = this.languageService.currentLanguage;
  public isLoading = signal<boolean>(false);
  public error = signal<boolean>(false);

  public first = signal<number>(0)
  public rows = signal<number>(10);
  public readonly totalRecords = signal<number>(0);

  public readonly pageIndex = computed(() => Math.floor(this.first() / this.rows()));

  constructor() {
    effect(() => {
      this.lang();
      this.first();
      this.rows();
      this.loadOrders();
    })
  }

  loadOrders() {
    const id = this.authService.getId();
    if (id == undefined) return;

    this.isLoading.set(true);
    this.error.set(false);

    this.ordersService.getUsersOrders(this.pageIndex(), this.rows(), DEFAULT_ORDERS_FILTER, this.lang(), id).pipe(
      finalize(() => this.isLoading.set(false))
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

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}