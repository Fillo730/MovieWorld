import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderListComponent } from "../../../components/order-list/order-list.component";
import { OrderFilterComponent } from "../../../components/order-filter/order-filter.component";
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { UpdateCreateOrderComponent } from '../../../components/update-create-order/update-create-order.component';
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';
import { ToastService } from '../../../services/toast.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { OrdersService } from '../../../services/orders.service';
import { Order, OrderState } from '../../../models/Order.model';
import { DEFAULT_ORDERS_FILTER, OrdersFilter } from '../../../models/filters/OrdersFilter.model';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'orders',
  standalone: true,
  imports: [
    CommonModule, 
    OrderListComponent, 
    OrderFilterComponent, 
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    MatIconModule,
    StateHandlerComponent
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {

  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private ordersService = inject(OrdersService);
  private languageService = inject(LanguageService);

  orders: Order[] = [];
  orderStates : OrderState[] = [];
  filters: OrdersFilter = { ...DEFAULT_ORDERS_FILTER };
  ordersCount !: number;
  ordersCompletedCount !: number;

  public lang = this.languageService.currentLanguage;

  totalRecords: number = 0;
  first : number = 0;
  rows : number = 10;

  isLoading: boolean = false;
  hasError: boolean = false;

  ngOnInit(): void {
    this.loadOrders();
    this.loadStates();
    this.loadCountsOrder();
  }

  loadStates() {
    this.ordersService.getOrderStates(this.lang()).subscribe(response => {
      if(response.success) {
        this.orderStates = response.data;
      }
    })
  }

  loadOrders() {
    this.isLoading = true;
    this.hasError = false;
    const pageIndex = Math.floor(this.first / this.rows);
    
    this.ordersService.getOrders(pageIndex, this.rows, this.filters, this.lang()).subscribe({
      next: (response) => {
        if(response.success) {
          this.orders = response.data.items;
          this.totalRecords = response.data.totalCount;
          this.isLoading = false;
        } else {
          this.hasError = true;
          this.isLoading = false;
        }
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadCountsOrder() {
    this.ordersService.getOrdersCount().subscribe(response => {
      if(response.success) this.ordersCount = response.data;
    });
    this.ordersService.getOrdersCompletedCount().subscribe(response => {
      if(response.success) this.ordersCompletedCount = response.data;
    });
  }

  handleRetry() {
    this.loadOrders();
  }

  handlePageChange(event : any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadOrders();
  }

  handleFiltersReset(): void {
    this.filters = { ...DEFAULT_ORDERS_FILTER };
    this.first = 0;
    this.loadOrders();
    this.toastService.success(this.translate.instant('Admin.OrdersPage.Messages.FiltersReset'));
  }

  handleFiltersChange(newFilters : OrdersFilter): void {
    this.filters = newFilters;
    this.first = 0;
    this.loadOrders();
  }

  addOrder(): void {
    const dialogRef = this.dialog.open(UpdateCreateOrderComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: this.translate.instant('Admin.OrdersPage.Dialog.AddTitle'),
        text: this.translate.instant('Admin.OrdersPage.Dialog.AddText'),
        cancelButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Create'),
        order: { userId: null, totalAmount: 0, state: 0, items: [], sellPoint: null },
        states: this.orderStates
      },
      panelClass: 'dialog-with-theme'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordersService.addOrder(result, this.lang()).subscribe(response => {
          if(response.success) {
            this.toastService.success(this.translate.instant('Admin.OrdersPage.Messages.AddSuccess'));
            this.loadOrders();
            this.loadCountsOrder();
          }
        });
      }
    });
  }

  updateOrder(orderId: number): void {
    const orderToEdit = this.orders.find(o => o.id === orderId);
    if (!orderToEdit) return;

    const dialogRef = this.dialog.open(UpdateCreateOrderComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: this.translate.instant('Admin.OrdersPage.Dialog.EditTitle'),
        text: this.translate.instant('Admin.OrdersPage.Dialog.EditText'),
        cancelButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Update'),
        order: { ...orderToEdit },
        states: this.orderStates
      },
      panelClass: 'dialog-with-theme'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordersService.updateOrder(result, this.lang()).subscribe(response => {
          if(response.success) {
            this.toastService.success(this.translate.instant('Admin.OrdersPage.Messages.UpdateSuccess'));
            this.loadOrders();
            this.loadCountsOrder();
          }
        });
      }
    });
  }

  deleteOrder(orderId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('Admin.OrdersPage.Dialog.DeleteTitle'),
        text: this.translate.instant('Admin.OrdersPage.Dialog.DeleteConfirm', { id: orderId }),
        cancelButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.OrdersPage.Buttons.Delete')
      },
      panelClass: 'dialog-with-theme'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const order = this.orders.find(o => o.id === orderId);
        if(order) {
          this.ordersService.deleteOrder(order).subscribe(response => {
            if(response.success) {
              this.toastService.success(this.translate.instant('Admin.OrdersPage.Messages.DeleteSuccess'));
              this.loadOrders();
              this.loadCountsOrder();
            }
          });
        }
      }
    });
  }
}