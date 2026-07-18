import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { OrderUserCardComponent } from '../order-user-card/order-user-card.component';
import { Order } from '../../models/Order.model';

@Component({
  selector: 'order-user-list-component',
  imports: [PaginatorModule, OrderUserCardComponent],
  templateUrl: './order-user-list.component.html',
  styleUrl: './order-user-list.component.css',
})

export class OrderUserListComponent {
  @Input() orders: Order[] = [];
  @Input() pagingOptions: number[] = [5, 10];

  @Input() first !: number;
  @Input() rows !: number;
  @Input() totalRecords !: number;

  @Output() onPageChange = new EventEmitter<any>();
  @Output() viewDetails = new EventEmitter<Order>();

  handlePageChange(event : any) {
    this.onPageChange.emit(event);
  }

  handleViewDetails(order: Order) {
    this.viewDetails.emit(order);
  }
}
