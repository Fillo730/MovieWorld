import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Order, OrderState } from '../../models/Order.model';
import { TranslateModule } from '@ngx-translate/core';
import { getOrderLabelColor } from '../../utils/mappingFunctions';

@Component({
  selector: 'order-card-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css',
})
export class OrderCardComponent {
  @Input() order!: Order;

  @Output() onEditOrder = new EventEmitter<number>();
  @Output() onDeleteOrder = new EventEmitter<number>(); 

  getBackgroundOrderNameColor() : string {
    return getOrderLabelColor(this.order.state);
  }

  getTotalItemsCount(): number {
    return this.order.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  handleEditOrder() : void {
    this.onEditOrder.emit(this.order.id);
  }

  handleDeleteOrder() : void {
    this.onDeleteOrder.emit(this.order.id);
  }
}