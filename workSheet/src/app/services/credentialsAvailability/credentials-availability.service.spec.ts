import { TestBed } from '@angular/core/testing';

import { CredentialsAvailabilityService } from './credentials-availability.service';

describe('CredentialsAvailabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CredentialsAvailabilityService = TestBed.get(CredentialsAvailabilityService);
    expect(service).toBeTruthy();
  });
});
