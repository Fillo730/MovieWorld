import { Component, OnInit, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { UserService } from '../../../services/user-service.server';
import { PersonService } from '../../../services/personService.service';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card.component';
import { MovieService } from '../../../services/movie.service';
import { OrdersService } from '../../../services/orders.service';
import { NewsService } from '../../../services/news.service';
import { GenreStat } from '../../../models/stats/GenreStat.model';
import { UserYear } from '../../../models/stats/UserYear.model';
import { ThemeService } from '../../../services/theme.service';
import { RevenueYear } from '../../../models/stats/RevenueYear.model';
import { UserRevenue } from '../../../models/stats/UserRevenue.model';
import { CurrencyPipe } from '@angular/common';
import { ChartOptionsMapper } from '../../../helper/ChartOptionsMapper.helper';
import { forkJoin } from 'rxjs';
import { UserMonth } from '../../../models/stats/UserMonth.model';
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';
import { OrdersPerOrderState } from '../../../models/stats/OrdersPerOrderState.model';

@Component({
  selector: 'dashboard-component',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule, 
    MatIconModule, 
    TranslatePipe,
    BaseChartDirective,
    DashboardCardComponent,
    StateHandlerComponent
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardAdminComponent implements OnInit {
  private translate = inject(TranslateService);
  private usersService = inject(UserService);
  private personsService = inject(PersonService);
  private moviesService = inject(MovieService);
  private ordersService = inject(OrdersService);
  private newsService = inject(NewsService);
  private themeService = inject(ThemeService);

  isLoading : boolean = false;
  errorLoading : boolean = false;

  totalUsers!: number;
  adminCount!: number;
  usersStandardCount!: number;
  usersYear !: UserYear[];
  usersTopSpending !: UserRevenue[];
  usersMonth !: UserMonth[];
  ordersPerUserRatio !: number;
  inactiveUsersCount !: number;
  
  totalCast !: number;
  actorsCount !: number;
  directorsCount !: number;

  moviesCount !: number;
  moviesCultCount !: number;
  genresStats !: GenreStat[];

  newsCount !: number;

  ordersCount !: number;
  ordersCompletedCount !: number;
  revenueYears !: RevenueYear[];
  ordersPerOrderState !: OrdersPerOrderState[];

  public pieChartUsers : ChartConfiguration<'pie'>['data'] = { labels: [], datasets: []}
  public pieChartCast : ChartConfiguration<'pie'>['data'] = { labels: [], datasets: []}
  public barChartMoviesGenres : ChartConfiguration<'bar'>['data'] = {labels : [], datasets: []}
  public barChartOrdersPerOrderState : ChartConfiguration<'bar'>['data'] = {labels : [], datasets: []}
  public lineChartUsersYears : ChartConfiguration<'line'>['data'] = {labels: [], datasets: []}
  public lineChartRevenueYears : ChartConfiguration<'line'>['data'] = {labels: [], datasets: []}
  public lineChartUsersMonth : ChartConfiguration<'line'>['data'] = {labels: [], datasets: []}

  public pieChartOptions: ChartConfiguration['options'] = ChartOptionsMapper.getPieChartOptions();
  public barChartOptions: ChartConfiguration['options'] = ChartOptionsMapper.getLineBarChartOptions();

  constructor() {
    effect(() => {
      this.themeService.isDark();

      const textColor = this.themeService.getChartTextColor();
      const isDark = this.themeService.isDark();
      this.pieChartOptions = ChartOptionsMapper.updatePieTheme(this.pieChartOptions, textColor);
      this.barChartOptions = ChartOptionsMapper.updateBarLineScalesTheme(this.barChartOptions, textColor, isDark);
    })
  }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => {
      this.loadData();
    })
  }

  loadData() {
    this.isLoading = true;
    forkJoin({
      admins: this.usersService.getAdminsCount(),
      totalUsers: this.usersService.getTotalUsersCount(),
      standards: this.usersService.getStandardUsersCount(),
      usersYear: this.usersService.getUsersForEveryYear(),
      topSpending: this.usersService.getTopSpendingUsers(5),
      usersMonth : this.usersService.getUserPerMonthLastMonths(),
      orderUser: this.usersService.getOrderPerUserRatio(),
      inactiveUsers: this.usersService.getInactiveUsersCount(),

      castTotal: this.personsService.getTotalPersonCount(),
      actors: this.personsService.getActorsCount(),
      directors: this.personsService.getDirectorsPersonCount(),

      movies: this.moviesService.getMoviesCount(),
      cult: this.moviesService.getMoviesCultCount(),
      genres: this.moviesService.getMoviesCountForEveryGenre(),
      news: this.newsService.getCount(),

      orders: this.ordersService.getOrdersCount(),
      ordersCompleted: this.ordersService.getOrdersCompletedCount(),
      revenue: this.ordersService.getRevenueForEveryYear(),
      ordersPerOrderState: this.ordersService.getOrdersCountPerOrderState()
    }).subscribe(res => {
      this.adminCount = res.admins.success ? res.admins.data : 0;
      this.totalUsers = res.totalUsers.success ? res.totalUsers.data : 0;
      this.usersStandardCount = res.standards.success ? res.standards.data : 0;
      this.usersYear = res.usersYear.data;
      this.usersTopSpending = res.topSpending.data;
      this.usersMonth = res.usersMonth.data;
      this.ordersPerUserRatio = res.orderUser.success ? res.orderUser.data : 0;
      this.inactiveUsersCount = res.inactiveUsers.success ? res.inactiveUsers.data : 0;

      this.totalCast = res.castTotal.data;
      this.actorsCount = res.actors.data;
      this.directorsCount = res.directors.data;

      this.moviesCount = res.movies.data;
      this.moviesCultCount = res.cult.data;
      this.genresStats = res.genres.data;
      this.newsCount = res.news.data;

      this.ordersCount = res.orders.data;
      this.ordersCompletedCount = res.ordersCompleted.data;
      this.revenueYears = res.revenue.data;
      this.ordersPerOrderState = res.ordersPerOrderState.data;
      console.log(this.ordersPerOrderState);

      this.refreshAllCharts();
      this.isLoading = false;
    }, error => {
      this.errorLoading = true;
      this.isLoading = false;
    });
  }

  refreshAllCharts()  : void {
    this.setUpMoviesCharts();
    this.setUpUserChart();
    this.setUpLineChartRevenue();
    this.setUpLineChartUser();
    this.setUpCastChart();
    this.setUpOrdersPerOrderStateChart();
  }

  private setUpMoviesCharts() : void {
    const labels = this.genresStats.map(g => g.genreName);
    const counts = this.genresStats.map(g => g.movieCount);
    this.barChartMoviesGenres = {
      labels: labels,
      datasets: [{
        data: counts,
        label: this.translate.instant('Admin.Dashboard.Labels.GenresMoviesLabel'),
        backgroundColor: '#3f51b5'
      }]
    }
  }

  private setUpOrdersPerOrderStateChart() : void {
    const labels = this.ordersPerOrderState.map(o => o.name);
    const counts = this.ordersPerOrderState.map(o => o.count);
    this.barChartOrdersPerOrderState = {
      labels: labels,
      datasets: [{
        data: counts,
        label: this.translate.instant('Admin.Dashboard.Labels.OrdersPerOrderStateLabel'),
        backgroundColor: '#3f51b5'
      }]
    }
  }

  private setUpUserChart() : void {
    this.pieChartUsers = {
      labels: [
        this.translate.instant('Admin.Dashboard.Labels.Admins'),
        this.translate.instant('Admin.Dashboard.Labels.StandardUsers')
      ],
      datasets: [{
        data: [this.adminCount, this.usersStandardCount],
        backgroundColor: ['#ff9800','#4caf50']
      }]
    }    
  }

  private setUpLineChartRevenue() : void {
    const labels = this.revenueYears.map(r => r.year);
    const data = this.revenueYears.map(r => r.revenue);
    this.lineChartRevenueYears = {
      labels: labels,
      datasets: [{
        data: data,
        label: this.translate.instant('Admin.Dashboard.Labels.RevenueYearsLabel'),
        fill: 'origin',
        tension: 0.4,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        pointBackgroundColor: '#3f51b5',
        pointRadius: 5
      }]
    }
  }

  private setUpLineChartUser() : void {
    const labels = this.usersYear.map(u => u.year);
    const data = this.usersYear.map(u => u.count);
    this.lineChartUsersYears = {
      labels: labels,
      datasets: [{
        data: data,
        label: this.translate.instant('Admin.Dashboard.Labels.UsersYearsLabel'),
        fill: 'origin',
        tension: 0.4,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        pointBackgroundColor: '#4caf50',
        pointRadius: 5
      }]
    }

    const monthLabels = this.usersMonth.map(u => this.translate.instant(`Months.${u.month}`));
    const monthData = this.usersMonth.map(u => u.count);
    this.lineChartUsersMonth = {
      labels: monthLabels,
      datasets: [{
        data: monthData,
        label: this.translate.instant('Admin.Dashboard.Labels.UsersMonthThisYearLabel'),
        fill: 'origin',
        tension: 0.4,
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        pointBackgroundColor: '#ff9800',
        pointRadius: 5
      }]
    }
  }

  private setUpCastChart() : void {
    this.pieChartCast = {
      labels: [
        this.translate.instant('Admin.Dashboard.Labels.Actors'),
        this.translate.instant('Admin.Dashboard.Labels.Directors')
      ],
      datasets: [{
        data: [this.actorsCount, this.directorsCount],
        backgroundColor: ['#ff9800','#4caf50']
      }]
    }
  }
}