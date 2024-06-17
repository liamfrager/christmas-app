import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent implements OnChanges {
  @Input({required: true}) icon!: string;
  @Input() hover: boolean = true;
  @Output() iconClicked = new EventEmitter();

  style = "material-symbols-outlined icon"
  ngOnChanges() {
    this.style = this.hover ? "material-symbols-outlined icon" : "material-symbols-outlined";
  }
}
