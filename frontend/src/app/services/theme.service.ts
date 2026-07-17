//Angular
import { Injectable, signal, computed, inject } from '@angular/core';

//Services
import { StorageService } from './storage.service';

//Constants
import { STORAGE_KEYS } from '../constants/storageKeys';
import { THEMES, ThemeType } from '../models/types/Theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageService = inject(StorageService);
  private readonly storageKey = STORAGE_KEYS.THEME;

  private readonly _theme = signal<ThemeType>(this.loadTheme());

  public readonly theme = this._theme.asReadonly();

  public readonly isDark = computed(() => this._theme() === THEMES.DARK);

  public readonly chartTextColor = computed(() => 
    this._theme() === THEMES.DARK ? '#ffffff' : '#0d0d0d'
  );

  public setTheme(theme: ThemeType): void {
    this._theme.set(theme);
    this.applyThemeToDom(theme);
    this.storageService.setItem(this.storageKey, theme);
  }

  public toggleTheme(): void {
    const nextTheme = this.isDark() ? THEMES.LIGHT : THEMES.DARK;
    this.setTheme(nextTheme);
  }

  private applyThemeToDom(theme: ThemeType): void {
    document.body.classList.remove(THEMES.DARK, THEMES.LIGHT);
    document.body.classList.add(theme);
  }

  private loadTheme(): ThemeType {
    const saved = this.storageService.getItem<ThemeType>(this.storageKey) ?? THEMES.DARK;
    this.applyThemeToDom(saved);
    return saved;
  }
}