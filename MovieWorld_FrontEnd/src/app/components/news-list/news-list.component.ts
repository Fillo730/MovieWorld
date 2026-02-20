//Angular Core
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

//External Libraries
import { PaginatorModule } from 'primeng/paginator';

//Components
import { NewsCardComponent } from '../news-card/news-card.component';

//Models
import { News } from '../../models/News.model';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'news-list-component',
  imports: [CommonModule, NewsCardComponent,PaginatorModule,TranslatePipe],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css',
})

export class NewsListComponent {
  @Input() newsList!: News[];
  @Input() isPaginatorActive : boolean = true;
  @Input() paginatorElements : number[] = [2,4,6];

  @Input() mainTitle !: string;
  @Input() findMoreButtonNewsLabel !: string;

  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;
  @Input() first: number = 0;

  @Output() modalOpened = new EventEmitter<News>();
  @Output() onPageChange = new EventEmitter<any>();
 
  handlePageChange(event: any) {
    this.onPageChange.emit(event);
  }

  handleOpenModal(news : News) {
    this.modalOpened.emit(news);
  }
}
