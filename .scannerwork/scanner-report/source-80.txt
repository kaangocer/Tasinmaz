import { TestBed } from '@angular/core/testing';

import { IlceService } from './ilce.service';

describe('IlceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IlceService = TestBed.get(IlceService);
    expect(service).toBeTruthy();
  });
});
