//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';

//External Libraries
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'slider-with-input-component',
  imports: [SliderModule, InputTextModule, FormsModule],
  templateUrl: './slider-with-input.component.html',
  styleUrls: ['./slider-with-input.component.css'],
})
export class SliderWithInputComponent {
  @Input() minValue!: number;
  @Input() maxValue!: number;
  @Input() value!: number | null;

  @Output() valueChange = new EventEmitter<number>();

  handleChange(val: number) {
    this.value = val;
    this.valueChange.emit(val);
  }
}
