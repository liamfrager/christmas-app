import { TestBed } from '@angular/core/testing';

import { DatabaseMigrationService } from './database-migration.service';

describe('DatabaseMigrationService', () => {
  let service: DatabaseMigrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseMigrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
