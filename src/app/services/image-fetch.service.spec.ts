import { TestBed } from '@angular/core/testing';

import { ImageFetchService } from './image-fetch.service';

describe('ImageFetchService', () => {
  let service: ImageFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
