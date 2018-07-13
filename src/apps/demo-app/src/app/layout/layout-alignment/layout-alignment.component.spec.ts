import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAlignmentComponent } from './layout-alignment.component';

describe('LayoutAlignmentComponent', () => {
  let component: LayoutAlignmentComponent;
  let fixture: ComponentFixture<LayoutAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
