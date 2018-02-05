import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackOverflowComponent } from './stack-overflow.component';

describe('StackOverflowComponent', () => {
  let component: StackOverflowComponent;
  let fixture: ComponentFixture<StackOverflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackOverflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackOverflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
