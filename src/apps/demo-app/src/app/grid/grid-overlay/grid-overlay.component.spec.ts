import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOverlayComponent } from './grid-overlay.component';

describe('GridOverlayComponent', () => {
  let component: GridOverlayComponent;
  let fixture: ComponentFixture<GridOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
