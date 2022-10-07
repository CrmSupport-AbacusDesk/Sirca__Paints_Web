import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMasterListComponent } from './scheme-master-list.component';

describe('SchemeMasterListComponent', () => {
  let component: SchemeMasterListComponent;
  let fixture: ComponentFixture<SchemeMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
