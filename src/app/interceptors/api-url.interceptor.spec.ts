import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { apiUrlInterceptor } from './api-url.interceptor';

describe('apiUrlInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('prefixes /api requests with the configured API url', async () => {
    const request = firstValueFrom(http.get('/api/get-chat-history'));

    httpTesting.expectOne(`${environment.apiUrl}/api/get-chat-history`).flush([]);

    expect(await request).toEqual([]);
  });

  it('leaves non-api requests unchanged', async () => {
    const request = firstValueFrom(http.get('/assets/config.json'));

    httpTesting.expectOne('/assets/config.json').flush({});

    expect(await request).toEqual({});
  });
});
