import { TestBed } from '@angular/core/testing';

import { UserValidator } from './user.validator';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserValidator = TestBed.get(UserValidator);
    expect(service).toBeTruthy();
  });
});
