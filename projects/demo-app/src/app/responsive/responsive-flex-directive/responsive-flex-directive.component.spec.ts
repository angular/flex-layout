import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveFlexDirectiveComponent } from './responsive-flex-directive.component';

describe('ResponsiveFlexDirectiveComponent', () => {
  let component: ResponsiveFlexDirectiveComponent;
  let fixture: ComponentFixture<ResponsiveFlexDirectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveFlexDirectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveFlexDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
