import { TestBed } from '@angular/core/testing';

import { PearlService } from './pearl.service';

describe('PearlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PearlService = TestBed.get(PearlService);
    expect(service).toBeTruthy();
  });
});
