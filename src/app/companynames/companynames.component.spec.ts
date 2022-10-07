import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanynamesComponent } from './companynames.component';

describe('CompanynamesComponent', () => {
  let component: CompanynamesComponent;
  let fixture: ComponentFixture<CompanynamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanynamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanynamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
