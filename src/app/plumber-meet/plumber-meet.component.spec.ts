import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumberMeetComponent } from './plumber-meet.component';

describe('PlumberMeetComponent', () => {
  let component: PlumberMeetComponent;
  let fixture: ComponentFixture<PlumberMeetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumberMeetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumberMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
