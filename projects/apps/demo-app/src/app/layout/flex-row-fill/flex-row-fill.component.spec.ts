import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexRowFillComponent } from './flex-row-fill.component';

describe('FlexRowFillComponent', () => {
  let component: FlexRowFillComponent;
  let fixture: ComponentFixture<FlexRowFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexRowFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexRowFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
