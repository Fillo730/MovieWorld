import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { interval } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { NotificationService } from './services/notification.service';

const NOTIFICATIONS_POLL_INTERVAL_MS = 30000;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private authService : AuthService,
    private cartService : CartService,
    private wishlistService : WishlistService,
    private notificationService : NotificationService
  ) {}

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.cartService.refreshCart().subscribe(response => {
      })
      this.wishlistService.refreshWishlistIds().subscribe(response => {
      })
      this.notificationService.refreshUnreadCount().subscribe(response => {
      })

      interval(NOTIFICATIONS_POLL_INTERVAL_MS).subscribe(() => {
        if (this.authService.isLoggedIn()) {
          this.notificationService.refreshUnreadCount().subscribe();
        }
      });
    }
  }
}
