import { Component, inject, OnInit } from "@angular/core";
import { Header } from "../../components/header/header.component";
import { Footer } from "../../components/footer/footer.component";
import { OrdersService } from "../../services/orders.service";
import { LanguageService } from "../../services/language.service";
import { DEFAULT_ORDERS_FILTER } from "../../models/filters/OrdersFilter.model";
import { AuthService } from "../../services/auth-service.service";
import { Order } from "../../models/Order.model";
import { OrderUserListComponent } from "../../components/order-user-list/order-user-list.component";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { StateHandlerComponent } from "../../components/state-handler/state-handler.component";
import { ThemeService } from "../../services/theme.service";
import { getButtonTypeBasedOnTheme } from "../../utils/themeFunctions";

@Component({
  selector: 'your-orders',
  standalone: true,
  imports: [Header, Footer, OrderUserListComponent, TranslatePipe, StateHandlerComponent],
  templateUrl: './your-orders.html',
  styleUrl: './your-orders.css',
})
export class YourOrders implements OnInit {
  private ordersService = inject(OrdersService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private translateService = inject(TranslateService);

  orders: Order[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  lang!: string;
  isLoading: boolean = false;
  error: boolean = false;

  ngOnInit() {
    this.lang = this.languageService.getLanguage();
    this.loadOrders();

    this.translateService.onLangChange.subscribe(() => {
      this.lang = this.languageService.getLanguage();
      this.loadOrders();
    })
  }

  loadOrders() {
    const id = this.authService.getId();
    if (id == undefined) return;

    this.isLoading = true;
    this.error = false;
    const pageIndex = Math.floor(this.first / this.rows);

    this.ordersService.getUsersOrders(pageIndex, this.rows, DEFAULT_ORDERS_FILTER, this.lang, id).subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data.items;
          this.totalRecords = response.data.totalCount;
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadOrders();
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}