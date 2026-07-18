import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Order } from '../../models/Order.model';
import { TranslateModule } from '@ngx-translate/core';
import { getOrderLabelColor } from '../../utils/mappingFunctions';
import { ThemeService } from '../../services/theme.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

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
    ButtonModule,
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

  @Output() viewDetails = new EventEmitter<Order>();

  private themeService = inject(ThemeService);

  getOrderStatusColor(): string {
    return getOrderLabelColor(this.order.state);
  }

  getTotalItemsCount(): number {
    return this.order.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  handleViewDetails(): void {
    this.viewDetails.emit(this.order);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}