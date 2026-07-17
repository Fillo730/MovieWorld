import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TooltipModule } from 'primeng/tooltip';
import { Order } from '../../models/Order.model';
import { TranslateModule } from '@ngx-translate/core';
import { getOrderLabelColor } from '../../utils/mappingFunctions';

@Component({
  selector: 'order-user-card-component',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    DividerModule,
    OverlayBadgeModule,
    TooltipModule,
    TranslateModule,
    CurrencyPipe,
    DatePipe,
    UpperCasePipe
  ],
  templateUrl: './order-user-card.component.html',
  styleUrl: './order-user-card.component.css',
})
export class OrderUserCardComponent {
  @Input() order!: Order;

  getOrderStatusColor(): string {
    return getOrderLabelColor(this.order.state);
  }

  getTotalItemsCount(): number {
    return this.order.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}