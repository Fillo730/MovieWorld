//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';

// External Libraries
import { ButtonModule } from 'primeng/button';

//Services
import { ThemeService } from '../../services/theme.service';

//Utils
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

@Component({
  selector: 'title-text-with-image-section-component',
  imports: [ButtonModule],
  templateUrl: './title-text-with-image-section.component.html',
  styleUrl: './title-text-with-image-section.component.css',
})
export class TitleTextWithImageSectionComponent {
  @Input() title!: string;
  @Input() text!: string;
  @Input() imagePath!: string;
  @Input() buttonLabel!: string;

  @Output() isGoToCatalogClicked = new EventEmitter<void>();
  
  constructor(private themeService : ThemeService) {}

  handleGoToCatalog() {
    this.isGoToCatalogClicked.emit();
  }

  handleButtonThem() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
