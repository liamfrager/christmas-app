import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListDisplayComponent } from '../../../components/list-components/list-display/list-display.component';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [ListDisplayComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class FamilyListComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  uid: string = "";
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'];
    });
  }
}
