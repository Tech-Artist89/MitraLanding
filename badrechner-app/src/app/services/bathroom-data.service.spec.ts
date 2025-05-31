import { TestBed } from '@angular/core/testing';

import { BathroomDataService } from './bathroom-data.service';

describe('BathroomDataService', () => {
  let service: BathroomDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BathroomDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
