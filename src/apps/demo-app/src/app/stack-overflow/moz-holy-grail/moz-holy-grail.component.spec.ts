import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MozHolyGrailComponent } from './moz-holy-grail.component';

describe('MozHolyGrailComponent', () => {
  let component: MozHolyGrailComponent;
  let fixture: ComponentFixture<MozHolyGrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MozHolyGrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MozHolyGrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
