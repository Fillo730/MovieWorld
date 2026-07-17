//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';

//Angular Material
import { MatButtonModule } from '@angular/material/button';

//Models
import { Movie } from '../../models/Movie.model';

@Component({
  selector: 'image-title-card-component',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './image-title-card.component.html',
  styleUrl: './image-title-card.component.css',
})
export class ImageTitleCard {
  @Input() name!: string;
  @Input() imagePath!: string;
  @Input() id !: number;
  @Input() isClicable : boolean = false;
  @Input() movieClicked !: Movie;
  @Input() isActorLabelDark : boolean = false;

  @Input() areButtonsVisible : boolean = false;
  @Input() editButtonLabel : string = "";
  @Input() deleteButtonLabel : string = "";

  @Output() cardClicked = new EventEmitter<Movie>();
  @Output() onEditCard = new EventEmitter<number>();
  @Output() onDeleteCard = new EventEmitter<number>();

  handleCardClicked() {
    this.cardClicked.emit(this.movieClicked);
  }

  handleEditCard() : void {
    this.onEditCard.emit(this.id);
  }

  handleDeleteCard() : void {
    this.onDeleteCard.emit(this.id);
  }
}
