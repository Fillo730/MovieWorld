import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { News } from '../../models/News.model';

@Component({
  selector: 'news-card-material',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule
  ],
  templateUrl: './news-card-material.component.html',
  styleUrl: './news-card-material.component.css',
})
export class NewsCardMaterialComponent {
  @Input() news!: News; 
  @Input() movieLabel!: string;
  @Input() actorLabel!: string;
  @Input() readMoreLabel!: string ;
  @Input() shareTitle!: string;
  @Input() updateLabel !: string;
  @Input() deleteLabel !: string;

  @Output() onUpdateNews = new EventEmitter<number>();
  @Output() onDeleteNews = new EventEmitter<number>();

  handleUpdateNews() : void {
    this.onUpdateNews.emit(this.news.id);
  }

  handleDeleteNews() : void {
    this.onDeleteNews.emit(this.news.id);
  }
}