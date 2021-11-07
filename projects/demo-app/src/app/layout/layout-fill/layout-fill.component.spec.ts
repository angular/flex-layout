import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFillComponent } from './layout-fill.component';

describe('LayoutFillComponent', () => {
  let component: LayoutFillComponent;
  let fixture: ComponentFixture<LayoutFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
