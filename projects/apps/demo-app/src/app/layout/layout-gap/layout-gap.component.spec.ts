import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutGapComponent } from './layout-gap.component';

describe('LayoutGapComponent', () => {
  let component: LayoutGapComponent;
  let fixture: ComponentFixture<LayoutGapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutGapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutGapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
