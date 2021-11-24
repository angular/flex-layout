import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue197Component } from './issue-197.component';

describe('Issue197Component', () => {
  let component: Issue197Component;
  let fixture: ComponentFixture<Issue197Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue197Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Issue197Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
