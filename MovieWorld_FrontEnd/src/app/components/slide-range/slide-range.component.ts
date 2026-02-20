//Angular Core
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

//External Libraries
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'slide-range',
  imports: [SliderModule, FormsModule],
  templateUrl: './slide-range.component.html',
  styleUrl: './slide-range.component.css',
})
export class SlideRangeComponent {
  @Input() minValue!: number;
  @Input() maxValue!: number;
  @Input() label!: string;

  @Input() min!: number;
  @Input() max!: number;

  @Output() changedValue = new EventEmitter<number[]>();

  rangeValues: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['min'] || changes['max']) {
      this.rangeValues = [this.min, this.max];
    }
  }

  handleChange(values: number[]) {
    this.rangeValues = values;
    this.changedValue.emit(values);
  }
}
