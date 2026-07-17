//Angular
import { Component } from '@angular/core';

//i18n
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'footer-component',
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class Footer {

}
