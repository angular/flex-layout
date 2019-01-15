import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardResponsiveComponent } from './dashboard.component';

describe('DocsResponsiveComponent', () => {
  let component: DashboardResponsiveComponent;
  let fixture: ComponentFixture<DashboardResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
