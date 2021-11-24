import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveShowHideComponent } from './responsive-show-hide.component';

describe('ResponsiveShowHideComponent', () => {
  let component: ResponsiveShowHideComponent;
  let fixture: ComponentFixture<ResponsiveShowHideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveShowHideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveShowHideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
