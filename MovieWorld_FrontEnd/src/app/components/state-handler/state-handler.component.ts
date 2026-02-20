import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'state-handler-component',
  standalone: true,
  imports: [ButtonModule, TranslatePipe, NgClass],
  templateUrl: './state-handler.component.html',
  styleUrl: './state-handler.component.css'
})
export class StateHandlerComponent {
  @Input() type: 'loading' | 'error' | 'empty' = 'loading';

  @Input() title: string = '';
  @Input() message: string = '';
  
  @Input() showButton: boolean = true;
  @Input() buttonLabel!: string; 
  @Input() buttonIcon: string = 'pi pi-refresh';
  @Input() buttonSeverity: any = 'primary';

  @Input() smallSection: boolean = false;
  
  @Output() action = new EventEmitter<void>();

  private themeService = inject(ThemeService);

  handleAction() {
    this.action.emit();
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}