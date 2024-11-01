import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-set-restrictions',
  standalone: true,
  imports: [],
  templateUrl: './set-restrictions.component.html',
  styleUrl: './set-restrictions.component.css'
})
export class SetRestrictionsComponent {
  constructor(public route: ActivatedRoute) {}

  async ngOnInit() {
    let ids = this.route.params.subscribe(p => {
      console.log(p)
    });
  }
}
