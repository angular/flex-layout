import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubIssuesComponent } from './github-issues.component';

describe('GithubIssuesComponent', () => {
  let component: GithubIssuesComponent;
  let fixture: ComponentFixture<GithubIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
