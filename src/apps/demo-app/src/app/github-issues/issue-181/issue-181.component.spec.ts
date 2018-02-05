import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue181Component } from './issue-181.component';

describe('Issue181Component', () => {
  let component: Issue181Component;
  let fixture: ComponentFixture<Issue181Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue181Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Issue181Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
