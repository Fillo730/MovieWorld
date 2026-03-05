import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private authService : AuthService, private cartService : CartService) {}

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.cartService.refreshCart().subscribe(response => {
      })
    }
  }
}
