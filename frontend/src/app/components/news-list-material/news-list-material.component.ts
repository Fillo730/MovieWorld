import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { News } from '../../models/News.model';
import { NewsCardMaterialComponent } from '../news-card-material/news-card-material.component';

@Component({
  selector: 'news-list-material',
  imports: [NewsCardMaterialComponent,PaginatorModule],
  templateUrl: './news-list-material.component.html',
  styleUrl: './news-list-material.component.css',
})

export class NewsListMaterialComponent {
  @Input() news !: News[]
  @Input() movieLabel!: string;
  @Input() actorLabel!: string;
  @Input() readMoreLabel!: string;
  @Input() shareTitle!: string;
  @Input() updateLabel!: string;
  @Input() deleteLabel!: string;
  
  @Input() pagingOptions : number[] = [3,6,9];
  @Input() first !: number;
  @Input() rows !: number;
  @Input() totalRecords !: number;

  @Output() onPageChange = new EventEmitter<any>();
  @Output() onDeleteNews = new EventEmitter<number>();
  @Output() onUpdateNews = new EventEmitter<number>();

  handlePageChange(event : any) : void {
    this.onPageChange.emit(event);
  }

  handleDeleteNews(id : number) : void {
    this.onDeleteNews.emit(id);
  }

  handleUpdateNews(id : number) : void {
    this.onUpdateNews.emit(id);
  }
}
