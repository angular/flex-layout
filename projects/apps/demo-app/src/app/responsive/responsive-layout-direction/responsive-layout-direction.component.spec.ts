import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveLayoutDirectionComponent } from './responsive-layout-direction.component';

describe('ResponsiveLayoutDirectionComponent', () => {
  let component: ResponsiveLayoutDirectionComponent;
  let fixture: ComponentFixture<ResponsiveLayoutDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveLayoutDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveLayoutDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
