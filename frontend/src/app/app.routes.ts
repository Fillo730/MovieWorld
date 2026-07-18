import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { Catalog } from './pages/catalog/catalog.component';
import { MovieDetail } from './pages/movie-detail/movie-detail.component';
import { Cart } from './pages/cart/cart.component';
import { Login } from './pages/login/login.component';
import { Signup } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SellPoints } from './pages/sell-points/sell-points.component';
import { cartGuard } from './guards/cart.guard';
import { YourOrders } from './pages/your-orders/your-orders';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

export const routes: Routes = [
    {path: 'home', component: Home},
    {path: 'catalog', component: Catalog},
    {path: 'movie-detail/:id', component: MovieDetail},
    {
        path: 'cart', component: Cart,
        canActivate: [cartGuard]
    },
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'sell-points', component: SellPoints},
    { 
        path: 'admin', 
        loadChildren: () => import('./pages/admin/admin-module').then(m => m.AdminModule),
    },
    {path: 'your-orders', component: YourOrders, 
        canActivate: [cartGuard]
    },
    {path: 'profile', component: ProfileComponent, canActivate: [cartGuard]},
    {path: 'wishlist', component: WishlistComponent, canActivate: [cartGuard]},
    { path: '**', redirectTo: '/home' }
];
