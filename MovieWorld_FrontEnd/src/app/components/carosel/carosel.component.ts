//Angular Core
import { Component, Input } from '@angular/core';

//PrimeNG
import { Carousel, CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'carosel-component',
  imports: [Carousel, CarouselModule],
  templateUrl: './carosel.component.html',
  styleUrl: './carosel.component.css',
})
export class CaroselComponent {
  @Input() images !: string[];

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
  ];
}
