import { TestBed } from '@angular/core/testing';

import { GiftExchangeService } from './gift-exchange.service';

describe('GiftExchangeService', () => {
  let service: GiftExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiftExchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
