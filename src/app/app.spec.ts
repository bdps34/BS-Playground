import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  it('renders the global UI shell around the router outlet', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('user-messages')).not.toBeNull();
    expect(element.querySelector('global-loading-indicator')).not.toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });
});
