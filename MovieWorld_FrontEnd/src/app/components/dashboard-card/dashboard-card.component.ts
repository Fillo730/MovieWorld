import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'dashboard-card-component',
  imports: [MatCardModule, MatIconModule, NgClass, DecimalPipe],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css',
})
export class DashboardCardComponent {
  @Input() value !: number;
  @Input() colorClass : 'blue' | 'orange' | 'green' | 'purple' = 'blue';
  @Input() icon !: string;
  @Input() label !: string;
}
