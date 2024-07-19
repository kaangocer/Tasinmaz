import { TestBed } from '@angular/core/testing';

import { IlService } from './il.service';

describe('IlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IlService = TestBed.get(IlService);
    expect(service).toBeTruthy();
  });
});
