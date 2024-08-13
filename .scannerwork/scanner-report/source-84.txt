import { TestBed } from '@angular/core/testing';

import { MahalleService } from './mahalle.service';

describe('MahalleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MahalleService = TestBed.get(MahalleService);
    expect(service).toBeTruthy();
  });
});
