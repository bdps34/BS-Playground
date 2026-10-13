import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator', () => {
  let fixture: ComponentFixture<LoadingIndicator>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoadingIndicator);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('is announced as a polite status region', () => {
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  it('uses the default size and label', () => {
    const image = element.querySelector('img')!;

    expect(image.getAttribute('alt')).toBe('Loading...');
    expect(image.width).toBe(32);
  });

  it('applies a custom size and label', async () => {
    fixture.componentRef.setInput('size', 48);
    fixture.componentRef.setInput('label', 'Loading page');
    await fixture.whenStable();

    const image = element.querySelector('img')!;
    expect(image.getAttribute('alt')).toBe('Loading page');
    expect(image.width).toBe(48);
    expect(image.height).toBe(48);
  });
});
