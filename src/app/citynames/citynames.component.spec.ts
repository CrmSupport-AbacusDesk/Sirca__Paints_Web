import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitynamesComponent } from './citynames.component';

describe('CitynamesComponent', () => {
  let component: CitynamesComponent;
  let fixture: ComponentFixture<CitynamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitynamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitynamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
