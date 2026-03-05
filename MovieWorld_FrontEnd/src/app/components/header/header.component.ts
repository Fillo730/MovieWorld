//Angular Core
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

//External Libraries
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

//Components
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';

//i18n
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

//Services
import { CartService } from '../../services/cart.service';
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";
import { AuthService } from '../../services/auth.service';
import { DEFAULT_AVATAR } from '../../utils/validURLPath';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AvatarModule,
    AvatarGroupModule,
    OverlayBadgeModule,
    TranslatePipe,
    ThemeTogglerComponent,
    LanguageSelectorComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header {
  cartService : CartService = inject(CartService);
  router : Router = inject(Router);
  authService : AuthService = inject(AuthService);
  toastService : ToastService = inject(ToastService);
  translateService : TranslateService = inject(TranslateService);

  isCartEmpty() {
    return this.cartService.isEmpty();
  }

  getCartNumberOfItems() {
    return this.cartService.itemsCount();
  }

  handleGoToCart() {
    this.router.navigate(['/cart']);
  }

  handleLogout() {
    this.authService.logout();
    this.toastService.success(this.translateService.instant('Header.LogoutMessage'));
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getProfileImage() {
    return this.authService.imagePath() ?? DEFAULT_AVATAR;
  }
}