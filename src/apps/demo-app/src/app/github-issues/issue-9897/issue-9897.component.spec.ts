import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue9897Component } from './issue-9897.component';

describe('Issue9897Component', () => {
  let component: Issue9897Component;
  let fixture: ComponentFixture<Issue9897Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue9897Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Issue9897Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
