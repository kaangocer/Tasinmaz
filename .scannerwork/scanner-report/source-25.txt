import { TestBed } from '@angular/core/testing';

import { GoogleMapsProxyService } from './google-maps-proxy.service';

describe('GoogleMapsProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleMapsProxyService = TestBed.get(GoogleMapsProxyService);
    expect(service).toBeTruthy();
  });
});
