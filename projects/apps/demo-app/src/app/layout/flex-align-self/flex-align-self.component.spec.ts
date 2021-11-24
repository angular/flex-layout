import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexAlignSelfComponent } from './flex-align-self.component';

describe('FlexAlignSelfComponent', () => {
  let component: FlexAlignSelfComponent;
  let fixture: ComponentFixture<FlexAlignSelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexAlignSelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexAlignSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
