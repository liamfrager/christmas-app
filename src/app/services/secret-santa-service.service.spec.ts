import { TestBed } from '@angular/core/testing';

import { SecretSantaServiceService } from './secret-santa-service.service';

describe('SecretSantaServiceService', () => {
  let service: SecretSantaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretSantaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
