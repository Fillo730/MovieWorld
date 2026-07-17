//Angular Core
import { Component, Input } from '@angular/core';

//External Libraries
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'tabs-component',
  imports: [TabsModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})

export class Tabs {
  @Input() tabValues: string[] = ["first tab","second tab","third tab"];
  
}
