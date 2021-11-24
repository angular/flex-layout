import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsResponsiveComponent } from './docs-responsive.component';

describe('DocsResponsiveComponent', () => {
  let component: DocsResponsiveComponent;
  let fixture: ComponentFixture<DocsResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
