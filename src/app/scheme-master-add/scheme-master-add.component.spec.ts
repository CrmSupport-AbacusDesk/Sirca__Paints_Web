import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMasterAddComponent } from './scheme-master-add.component';

describe('SchemeMasterAddComponent', () => {
  let component: SchemeMasterAddComponent;
  let fixture: ComponentFixture<SchemeMasterAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeMasterAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeMasterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
