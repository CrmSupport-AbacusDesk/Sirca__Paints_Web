import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumberMeetDetailComponent } from './plumber-meet-detail.component';

describe('PlumberMeetDetailComponent', () => {
  let component: PlumberMeetDetailComponent;
  let fixture: ComponentFixture<PlumberMeetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumberMeetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumberMeetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
