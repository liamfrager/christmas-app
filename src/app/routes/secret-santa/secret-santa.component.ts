import { Component, OnInit } from '@angular/core';
import { SecretSantaServiceService } from '../../services/secret-santa-service.service';
import { AccountService } from '../../services/account.service';

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
  selector: 'app-secret-santa',
  standalone: true,
  imports: [],
  templateUrl: './secret-santa.component.html',
  styleUrl: './secret-santa.component.css'
})
export class SecretSantaComponent implements OnInit {

  constructor(private secretSantaService: SecretSantaServiceService, private accountService: AccountService) {}

  ngOnInit() {
    const userGroups = this.accountService.currentUser.groups;
    if (userGroups) {
      userGroups.forEach(groupID => {
        this.secretSantaService.getGroupInfo(groupID).then(data => {
          console.log(data);
        })
      })
    }
    this.secretSantaService.getGroupInfo("rS2ooxxv4L4AuxbKje5V").then(data => {
      console.log(data);
    })
    console.log(this.accountService.currentUser)
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
