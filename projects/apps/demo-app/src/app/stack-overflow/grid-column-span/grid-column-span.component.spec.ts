import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColumnSpanComponent } from './grid-column-span.component';

describe('GridColumnSpanComponent', () => {
  let component: GridColumnSpanComponent;
  let fixture: ComponentFixture<GridColumnSpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColumnSpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
