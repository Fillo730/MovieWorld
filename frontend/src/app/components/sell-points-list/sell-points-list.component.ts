import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { SellPointCardComponent } from '../sell-point-card/sell-point-card.component';
import { scrollToTop } from '../../utils/windowFunctions';
import { SellPoint } from '../../models/SellPoint.model';

@Component({
  selector: 'sell-points-list-component',
  imports: [SellPointCardComponent, PaginatorModule],
  templateUrl: './sell-points-list.component.html',
  styleUrl: './sell-points-list.component.css',
})
export class SellPointsListComponent {
  @Input() sellPoints!: SellPoint[];
  @Input() isPaginatorActive: boolean = true;
  @Input() isSelectable: boolean = false;
  @Input() isDistanceOnCardsVisible: boolean = false;
  @Input() paginatorElements: number[] = [10, 15];
  @Input() searchOnMapsLabel!: string;

  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;
  @Input() first: number = 0;

  @Input() selectedSellPoint?: SellPoint;
  @Input() preferredSellPointId?: number | null;
  @Input() preferredLabel: string = '';

  @Output() clickedSellPoint = new EventEmitter<SellPoint>();
  @Output() pageChanged = new EventEmitter<any>();

  handleClickedSellPoint(event: SellPoint) {
    this.selectedSellPoint = event;
    this.clickedSellPoint.emit(event);
  }

  onPageChange(event: any) {
    if (!this.isPaginatorActive) return;
    this.first = event.first;
    this.rows = event.rows;
    this.pageChanged.emit(event);
    scrollToTop();
  }
}