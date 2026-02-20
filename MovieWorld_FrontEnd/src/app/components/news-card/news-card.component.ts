//Angular Core
import { Component, EventEmitter, Input, Output} from '@angular/core';

//External Libraries
import { ButtonModule } from 'primeng/button';

//Services
import { ThemeService } from '../../services/theme.service';

//Utils
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

//Models
import { News } from '../../models/News.model';

@Component({
  selector: 'news-card-component',
  imports: [ButtonModule],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css',
})

export class NewsCardComponent {
  @Input() news !: News;
  @Input() findMoreButtonLabel !: string;
  
  @Input() modifyButtonLabel !: string;
  @Input() deleteButtonLabel !: string;

  @Output() modalOpened = new EventEmitter<News>();

  constructor(private themeService : ThemeService) {}

  handleOpenModal() {
    this.modalOpened.emit(this.news);
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
