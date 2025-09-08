import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, NewGroup } from '../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { GroupsService } from '../../../services/groups.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent {
  constructor(
    private groupsService: GroupsService, 
  ) {}
  @Input() group?: Group;
  @Output() onFormSubmit = new EventEmitter();
  // Form values
  nameVal?: string;
  descriptionVal?: string;

  async ngOnInit() {
    this.nameVal = this.group ? this.group.name : '';
    this.descriptionVal = this.group ? this.group.description : '';
  }

  async onSubmit(form: NgForm) {
    const newGroup: NewGroup = {
      name: form.form.value.group,
      description: form.form.value.description,
    }
    if (this.group) { // If editing gift.
      if (JSON.stringify(this.group) == JSON.stringify({...this.group, ...newGroup})) { // If gift hasn't changed.
        this.onFormSubmit.emit(false);
      } else {
        this.groupsService.updateGroup(this.group, newGroup);
        this.onFormSubmit.emit(newGroup);
      }
    } else {
      this.onFormSubmit.emit(newGroup);
    }
  }
}
