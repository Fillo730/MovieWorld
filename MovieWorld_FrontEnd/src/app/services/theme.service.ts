import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private key = 'theme';

  private _isDark = signal<boolean>(true);
  public isDark = this._isDark.asReadonly();

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    this.setTheme(!this._isDark());
  }

  setTheme(dark: boolean) {
    this._isDark.set(dark);
    const theme = dark ? 'dark' : 'light';
    
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme + '-mode');
    localStorage.setItem(this.key, theme);
  }

  getChartTextColor(): string {
    return this._isDark() ? '#ffffff' : '#0d0d0d';
  }

  private loadTheme() {
    const saved = localStorage.getItem(this.key);
    this.setTheme(saved !== 'light'); 
  }
}