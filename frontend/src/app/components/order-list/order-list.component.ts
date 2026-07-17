import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { OrderCardComponent } from '../order-card/order-card.component';
import { Order } from '../../models/Order.model';

@Component({
  selector: 'order-list-component',
  standalone: true,
  imports: [OrderCardComponent, PaginatorModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent  {
  @Input() orders: Order[] = [];
  @Input() pagingOptions: number[] = [5, 10, 15];

  @Input() first !: number;
  @Input() rows !: number;
  @Input() totalRecords !: number;

  @Output() onEditOrder = new EventEmitter<number>();
  @Output() onDeleteOrder = new EventEmitter<number>(); 
  @Output() onPageChange = new EventEmitter<any>();

  handlePageChange(event : any) : void {
    this.onPageChange.emit(event);
  }

  handleEditOrder(id: number) : void {
    this.onEditOrder.emit(id);
  }

  handleDeleteOrder(id: number) : void {
    this.onDeleteOrder.emit(id);
  }
}