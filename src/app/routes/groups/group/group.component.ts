import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../types';
import { GroupsService } from '../../../services/groups.service';
import { PageHeadingComponent } from '../../../components/page-heading/page-heading.component';
import { CommonModule, Location } from '@angular/common';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { GiftExchangeComponent } from '../../../components/gift-exchange/gift-exchange.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, UserDisplayComponent, GiftExchangeComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent {
  constructor(
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    public location: Location,
    private router: Router,
  ) {};
  
  groupID: string = this.route.snapshot.paramMap.get('group-id')!;
  group?: Group;
  showBackButton: boolean = true;

  async ngOnInit() {
    this.group = await this.groupsService.getGroup(this.groupID);
  }

  onIconClick(icon: string) {
    if (icon === 'person_add')
      this.router.navigate(['groups', this.groupID, 'add-member'], { state: { group: this.group } });
  }
}
