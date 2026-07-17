//Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { DashboardAdminComponent } from './dashboard/dashboard';
import { UsersAdminComponent } from './users/users';
import { MoviesAdmimComponent } from './movies/movies';
import { CastAdminComponent } from './cast/cast.component';
import { NewsComponent } from './news/news';
import { OrdersComponent } from './orders/orders';
import { adminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'users', component: UsersAdminComponent},
      { path: 'movies', component: MoviesAdmimComponent},
      { path: 'cast', component: CastAdminComponent},
      { path: 'news', component: NewsComponent},
      { path: 'orders', component: OrdersComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
