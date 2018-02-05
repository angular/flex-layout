import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue135Component } from './issue-135.component';

describe('Issue135Component', () => {
  let component: Issue135Component;
  let fixture: ComponentFixture<Issue135Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue135Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Issue135Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
