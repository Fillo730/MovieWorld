//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

//Components
import { ImageTitleCard } from '../image-title-card/image-title-card.component';

//External Libraries
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

//Services
import { ThemeService } from '../../services/theme.service';

//Utils
import { goToMovieDetail } from '../../utils/navigationFunctions';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

//Models
import { News } from '../../models/News.model';
import { Movie } from '../../models/Movie.model';

@Component({
  selector: 'modal-component',
  imports: [DialogModule, ButtonModule, ImageTitleCard, ImageTitleCard],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isVisible !: boolean;
  @Input() news !: News;

  @Output() isModalClosed = new EventEmitter<boolean>();

  constructor (private router : Router, private themeService : ThemeService) {}

  handleCloseModal() : void{
    this.isModalClosed.emit();
  }

  handleMovieClick(movie: Movie) : void{
    goToMovieDetail(movie, this.router);
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
