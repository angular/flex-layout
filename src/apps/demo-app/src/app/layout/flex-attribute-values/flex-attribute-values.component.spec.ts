import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexAttributeValuesComponent } from './flex-attribute-values.component';

describe('FlexAttributeValuesComponent', () => {
  let component: FlexAttributeValuesComponent;
  let fixture: ComponentFixture<FlexAttributeValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexAttributeValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexAttributeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
