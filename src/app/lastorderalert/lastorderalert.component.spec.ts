import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastorderalertComponent } from './lastorderalert.component';

describe('LastorderalertComponent', () => {
  let component: LastorderalertComponent;
  let fixture: ComponentFixture<LastorderalertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastorderalertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastorderalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
