import { TestBed } from '@angular/core/testing';

import { TokenUtil } from './token-util.util';

describe('TokenUtilUtilTsService', () => {
  let service: TokenUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
