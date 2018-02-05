import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaQueryStatusComponent } from './media-query-status.component';

describe('MediaQueryStatusComponent', () => {
  let component: MediaQueryStatusComponent;
  let fixture: ComponentFixture<MediaQueryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaQueryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaQueryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
