import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreawisesalesreportComponent } from './areawisesalesreport.component';

describe('AreawisesalesreportComponent', () => {
  let component: AreawisesalesreportComponent;
  let fixture: ComponentFixture<AreawisesalesreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreawisesalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreawisesalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
