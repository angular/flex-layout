/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {UnifiedModule} from '@angular/flex-layout/uni';
import {Component} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

import {MOCK_PROVIDER, MockMediaMatcher} from './mock-media-matcher';


@Component({
  template: `
    <div ngl order="1" hide layoutAlign="center">
      <bp tag="xs" order="2" show></bp>
      <bp tag="md" order="3"></bp>
    </div>
  `,
})
class TestComponent {
}

describe('unified', () => {
  let fixture: ComponentFixture<TestComponent>;
  let mediaMatcher: MockMediaMatcher;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [UnifiedModule.withDefaults()],
      declarations: [TestComponent],
      providers: [MOCK_PROVIDER]
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
  });

  beforeEach(inject([MediaMatcher], (mm: MockMediaMatcher) => {
    mediaMatcher = mm;
  }));

  it('should work', () => {
    mediaMatcher.activateBp('xs');
    fixture.detectChanges();
    console.log(fixture.debugElement.nativeElement);
    mediaMatcher.deactivateBp('xs');
    mediaMatcher.activateBp('md');
    fixture.detectChanges();
    console.log(fixture.debugElement.nativeElement);
  });
});
