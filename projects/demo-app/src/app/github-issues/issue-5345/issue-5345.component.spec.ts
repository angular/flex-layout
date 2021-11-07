import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue5345Component } from './issue-5345.component';

describe('Issue5345Component', () => {
  let component: Issue5345Component;
  let fixture: ComponentFixture<Issue5345Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue5345Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Issue5345Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
