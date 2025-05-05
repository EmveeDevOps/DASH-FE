import { TestBed } from '@angular/core/testing';
import { HttpTokenInterceptor } from './http-token-interceptor.interceptor';

describe('HttpTokenInterceptorInterceptorTsService', () => {
  let service: HttpTokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTokenInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
