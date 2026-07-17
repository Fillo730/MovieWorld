import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { UsersFilterComponent } from "../../../components/users-filter/users-filter.component";
import { UpdateUserDialogComponent } from '../../../components/update-user-dialog/update-user-dialog.component';
import { UsersListComponent } from "../../../components/users-list/users-list.component";
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';

import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user-service.server';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { scrollToTop } from '../../../utils/windowFunctions';

import { User } from '../../../models/User.model';
import { UsersFilter, DEFAULT_USERS_FILTER } from '../../../models/filters/UsersFilter.model';
import { getValidImagePath, PathType } from '../../../utils/validURLPath';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    TranslatePipe,
    UsersFilterComponent,
    UsersListComponent,
    StateHandlerComponent
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  totalCount: number = 0;

  totalUsers: number = 0;
  adminCount: number = 0;
  standardCount: number = 0;
  
  pageIndex: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  error: boolean = false;
  
  currentFilters: UsersFilter = { ...DEFAULT_USERS_FILTER };

  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUsers();
    this.loadCounts();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = false;
    this.userService.getUsers(this.pageIndex, this.pageSize, this.currentFilters).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.items;
          this.totalCount = response.data.totalCount;
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  loadCounts(): void {
    forkJoin({
      admins: this.userService.getAdminsCount(),
      standard: this.userService.getStandardUsersCount()
    }).subscribe(({ admins, standard }) => {
      if (admins.success) this.adminCount = admins.data;
      if (standard.success) this.standardCount = standard.data;
      this.totalUsers = this.adminCount + this.standardCount;
    });
  }

  handlePageChange(event: any): void {
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.loadUsers();
    scrollToTop();
  }

  onFilterChanged(filters: UsersFilter) {
    this.currentFilters = filters;
    this.pageIndex = 0;
    this.loadUsers();
  }

  resetFilters() {
    this.currentFilters = { ...DEFAULT_USERS_FILTER };
    this.pageIndex = 0;
    this.loadUsers();
    this.toastService.success(this.translate.instant('Admin.UsersPage.Messages.FiltersReset'));
  }

  deleteUser(userId: number): void {
    const user = this.users.find(u => u.userId === userId);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('Admin.UsersPage.Dialog.DeleteTitle'),
        text: this.translate.instant('Admin.UsersPage.Dialog.DeleteConfirm', { name: `${user?.name} ${user?.surname}` }),
        cancelButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Delete'),
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId).subscribe(res => {
          if (res.success) {
            this.loadUsers();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.UsersPage.Messages.DeleteSuccess'));
          }
        });
      }
    });
  }

  updateUser(userId: number): void {
    const userToEdit = this.users.find(u => u.userId === userId);
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Admin.UsersPage.Dialog.EditTitle'),
        cancelButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Edit'),
        user: { ...userToEdit }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.imagePath = getValidImagePath(result.imagePath, PathType.person);
        this.userService.updateUser(result).subscribe(res => {
          if (res.success) {
            this.loadUsers();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.UsersPage.Messages.UpdateSuccess'));
          }
        });
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Admin.UsersPage.Dialog.AddTitle'),
        cancelButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.UsersPage.Buttons.Create'),
        user: { name: '', surname: '', email: '', role: 0, imagePath: '' }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.imagePath = getValidImagePath(result.imagePath, PathType.person);
        this.userService.createUser(result).subscribe(res => {
          if (res.success) {
            this.loadUsers();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.UsersPage.Messages.AddSuccess'));
          }
        });
      }
    });
  }
}