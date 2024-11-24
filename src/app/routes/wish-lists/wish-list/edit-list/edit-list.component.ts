import { Component, OnInit } from '@angular/core';
import { PageHeadingComponent } from "../../../../components/page-heading/page-heading.component";
import { ListFormComponent } from "../../../../components/forms/list-form/list-form.component";
import { CommonModule, Location } from '@angular/common';
import { List } from '../../../../types';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, ListFormComponent],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.css'
})
export class EditListComponent implements OnInit {
  constructor(
    public location: Location,
  ) {}

  editingList?: List;

  ngOnInit() {
    this.editingList = history.state.list;
    console.log(this.editingList);
  }

}
