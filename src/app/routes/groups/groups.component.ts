import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { GroupsDisplayComponent } from '../../components/groups-display/groups-display.component';
import { User } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { RefreshService } from '../../services/refresh.service';
import { CommonModule, Location } from '@angular/common';
import { GroupsService } from '../../services/groups.service';

// array shuffle function I found on stack overflow
function shuffle(array: any[]) {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, GroupsDisplayComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public accountService: AccountService,
    public groupsService: GroupsService,
    public location: Location,
  ) {};
  IDParam: string | undefined | null;
  user?: User;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('user-id');
    this.IDParam = IDParam;
  }

  @RefreshService.onRefresh()
  async onRefresh() {
    if (this.IDParam) {
      this.user = await this.accountService.getUserInfo(this.IDParam);
    } else {
      this.user = this.accountService.currentUser;
    }
  }

  onIconClick(icon: string) {
    if (icon === 'inbox_text_share')
      this.router.navigate(['/groups/requests']);
    if (icon === 'add_circle')
      this.router.navigate(['/groups/add-group']);
  }

  /**
   * Matches gift givers to gift receivers 
   * @param gifters - Array of ids for gifters
   * @param receivers - Array of ids for remaining receivers
   * @param restrictions - Map of restrictions
   * @returns A map where the key is the gift giver, and the value is the gift reciever
   */
  matchSecretSanta(gifters: string[], receivers: string[], restrictions: Map<string, string[]>): Map<string, string> {
    if(gifters.length === 0) {
      return new Map()
    }
    const currentGifter = gifters[0];
    const possibleGiftees = receivers.filter(id => id !== currentGifter && !restrictions.get(currentGifter)?.includes(id))
    for(const r of shuffle(possibleGiftees)) {
      const subMap = this.matchSecretSanta(gifters.slice(1), receivers.filter(rc => rc !== r), restrictions);
      if(subMap.size === gifters.length - 1) {
        subMap.set(currentGifter, r);
        return subMap;
      }
    }
    return new Map();
  }


}
