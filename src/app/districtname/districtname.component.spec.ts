import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictnameComponent } from './districtname.component';

describe('DistrictnameComponent', () => {
  let component: DistrictnameComponent;
  let fixture: ComponentFixture<DistrictnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
