//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';

//External Libraries
import { ButtonModule } from 'primeng/button';

//Services
import { ThemeService } from '../../services/theme.service';

//Pipes
import { KmLabelPipe } from '../../pipes/kmLabel.pipe';

//Utils
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';

//Models
import { SellPoint } from '../../models/SellPoint.model';

@Component({
  selector: 'sell-point-card',
  standalone: true,
  imports: [ButtonModule,KmLabelPipe],
  templateUrl: './sell-point-card.component.html',
  styleUrls: ['./sell-point-card.component.css']
})
export class SellPointCardComponent {
  @Input() sellPoint!: SellPoint;
  @Input() isDistanzaVisible : boolean = false;
  @Input() isSelectable : boolean = false;
  @Input() isSelected : boolean = false;
  @Input() searchOnMapsLabel!: string;

  @Output() clickedSellPoint = new EventEmitter<SellPoint>();

  constructor(private themeService : ThemeService) {} 

  handleClickSellPoint() {
    this.clickedSellPoint.emit(this.sellPoint);
  }
  
  handleGoToMaps() {
    if (!this.sellPoint) return;

    let mapsUrl = '';

    if (this.sellPoint.lat && this.sellPoint.lng) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${this.sellPoint.lat},${this.sellPoint.lng}`;
    } else {
      const fullAddress = `${this.sellPoint.address}, ${this.sellPoint.cap} ${this.sellPoint.city} (${this.sellPoint.province})`;
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }

    window.open(mapsUrl, '_blank');
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}