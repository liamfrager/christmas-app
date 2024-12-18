import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-filler',
  standalone: true,
  imports: [],
  templateUrl: './filler.component.html',
  styleUrl: './filler.component.css'
})
export class FillerComponent implements OnChanges {
  @Input() size: string = '1em';

  ngOnChanges() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (this.size === 'header')
      this.size = '8em';
    else if (this.size === 'footer')
      this.size = isPWA ? '5.5em' : '4em';
  }
}
