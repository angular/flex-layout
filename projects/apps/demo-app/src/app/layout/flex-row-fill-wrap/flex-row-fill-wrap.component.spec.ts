import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexRowFillWrapComponent } from './flex-row-fill-wrap.component';

describe('FlexRowFillWrapComponent', () => {
  let component: FlexRowFillWrapComponent;
  let fixture: ComponentFixture<FlexRowFillWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexRowFillWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexRowFillWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
