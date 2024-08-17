import { Component, OnInit } from '@angular/core';

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
export class SecretSantaComponent implements OnInit{

  ngOnInit() {
    const ids = ['1', '2', '3', '4', '5', '6']
    const restrictions = new Map()
    restrictions.set('1', ['3', '4'])
    restrictions.set('2', ['1', '6'])
    restrictions.set('3', ['4', '5'])
    restrictions.set('4', ['6', '1'])
    restrictions.set('5', ['2', '3'])
    restrictions.set('6', ['5', '2'])
    console.log('starting the search for pairings')
    // const pairings = this.matchSecretSanta(ids, restrictions);
    const pairings = this.matchSecretSanta(ids, ids, restrictions);
    console.log(pairings);
  }

  /**
   * Function for matching gift givers to gift receivers 
   * @param gifters array of ids for gifters
   * @param receivers array of ids for remaining receivers
   * @param restrictions map of restrictions
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
