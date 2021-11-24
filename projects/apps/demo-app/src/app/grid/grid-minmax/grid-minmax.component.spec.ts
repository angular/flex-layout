import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMinmaxComponent } from './grid-minmax.component';

describe('GridMinmaxComponent', () => {
  let component: GridMinmaxComponent;
  let fixture: ComponentFixture<GridMinmaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridMinmaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMinmaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
