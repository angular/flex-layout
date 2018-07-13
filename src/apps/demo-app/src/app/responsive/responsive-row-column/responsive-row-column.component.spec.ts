import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveRowColumnComponent } from './responsive-row-column.component';

describe('ResponsiveRowColumnComponent', () => {
  let component: ResponsiveRowColumnComponent;
  let fixture: ComponentFixture<ResponsiveRowColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveRowColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveRowColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
