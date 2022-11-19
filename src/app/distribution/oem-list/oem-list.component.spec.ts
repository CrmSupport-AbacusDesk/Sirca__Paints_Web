import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemListComponent } from './oem-list.component';

describe('OemListComponent', () => {
  let component: OemListComponent;
  let fixture: ComponentFixture<OemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
