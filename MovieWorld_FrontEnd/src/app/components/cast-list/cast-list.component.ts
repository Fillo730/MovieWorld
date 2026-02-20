import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ImageTitleCard } from '../image-title-card/image-title-card.component';
import { Person } from '../../models/Person.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'cast-list-component',
  standalone: true,
  imports: [ImageTitleCard, PaginatorModule, TranslatePipe],
  templateUrl: './cast-list.component.html',
  styleUrl: './cast-list.component.css',
})
export class CastListComponent {
  @Input() actors: Person[] = [];
  @Input() totalRecords: number = 0;
  @Input() rows: number = 20;
  @Input() first: number = 0;
  @Input() pagingOptions: number[] = [10, 20, 30];

  @Output() onDelete = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<number>();
  @Output() onPageChange = new EventEmitter<PaginatorState>();

  handlePageChange(event: PaginatorState): void {
    this.onPageChange.emit(event);
  }

  deletePerson(personId: number): void {
    this.onDelete.emit(personId);
  }

  updatePerson(personId: number): void {
    this.onUpdate.emit(personId);
  }
}