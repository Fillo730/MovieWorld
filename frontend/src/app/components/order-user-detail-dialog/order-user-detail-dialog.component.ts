import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../models/Order.model';
import { getOrderLabelColor } from '../../utils/mappingFunctions';
import { ThemeService } from '../../services/theme.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

@Component({
  selector: 'order-user-detail-dialog-component',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TagModule,
    ButtonModule,
    DividerModule,
    TranslateModule,
    CurrencyPipe,
    DatePipe,
    UpperCasePipe
  ],
  templateUrl: './order-user-detail-dialog.component.html',
  styleUrl: './order-user-detail-dialog.component.css',
})
export class OrderUserDetailDialogComponent {
  @Input() order: Order | null = null;
  @Input() isVisible: boolean = false;

  @Output() isDialogClosed = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  handleClose(): void {
    this.isDialogClosed.emit();
  }

  getOrderStatusColor(): string {
    return this.order ? getOrderLabelColor(this.order.state) : '';
  }

  getTotalItemsCount(): number {
    return this.order ? this.order.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
