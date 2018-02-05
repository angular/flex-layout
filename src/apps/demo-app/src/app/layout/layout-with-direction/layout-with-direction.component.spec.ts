import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWithDirectionComponent } from './layout-with-direction.component';

describe('LayoutWithDirectionComponent', () => {
  let component: LayoutWithDirectionComponent;
  let fixture: ComponentFixture<LayoutWithDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutWithDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutWithDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
