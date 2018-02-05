import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAreaRowSpanComponent } from './grid-area-row-span.component';

describe('GridAreaRowSpanComponent', () => {
  let component: GridAreaRowSpanComponent;
  let fixture: ComponentFixture<GridAreaRowSpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridAreaRowSpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAreaRowSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
