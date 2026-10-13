import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { GlobalLoadingService } from '../services/global-loading.service';
import { GlobalLoadingIndicator } from './global-loading-indicator';

@Component({ template: '' })
class EmptyPage {}

describe('GlobalLoadingIndicator', () => {
  let fixture: ComponentFixture<GlobalLoadingIndicator>;
  let element: HTMLElement;
  let resolveSlowPage: () => void;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'slow',
            component: EmptyPage,
            resolve: { data: () => new Promise<void>((resolve) => (resolveSlowPage = resolve)) },
          },
        ]),
      ],
    });

    fixture = TestBed.createComponent(GlobalLoadingIndicator);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  function overlay() {
    return element.querySelector('.global-loading-indicator');
  }

  it('is hidden by default', () => {
    expect(overlay()).toBeNull();
  });

  it('follows the loading service', async () => {
    const globalLoadingService = TestBed.inject(GlobalLoadingService);

    globalLoadingService.show();
    await fixture.whenStable();
    expect(overlay()?.querySelector('img')?.getAttribute('alt')).toBe('Loading page');

    globalLoadingService.hide();
    await fixture.whenStable();
    expect(overlay()).toBeNull();
  });

  it('is shown while a navigation is in progress', async () => {
    const navigation = TestBed.inject(Router).navigateByUrl('/slow');

    await vi.waitFor(() => expect(overlay()).not.toBeNull());

    resolveSlowPage();
    await navigation;
    await fixture.whenStable();

    expect(overlay()).toBeNull();
  });
});
