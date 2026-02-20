//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

//External Libraris
import { ButtonModule } from 'primeng/button';

//Models
import { Movie } from '../../models/Movie.model';

@Component({
  selector: 'cart-item-component',
  imports: [ButtonModule,CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})

export class CartItemComponent {
  @Input() movie !: Movie;
  @Input() quantity !: number;
  @Input() quantityLabel !: string;
  @Input() removeButtonLabel: string = "Remove";
  @Output() onRemoveItem = new EventEmitter<void>();

  handleRemoveItem(movie : Movie) {
    this.onRemoveItem.emit();
  }
}
