import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';

import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer,
    AvatarModule,
    ButtonModule,
    DividerModule,
    TagModule,
    FieldsetModule,
    ChipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  currentUser = this.authService.currentUser();

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  handleLogout() : void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }

}