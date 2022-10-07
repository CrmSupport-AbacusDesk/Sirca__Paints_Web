import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTargetComponent } from './area-target.component';

describe('AreaTargetComponent', () => {
  let component: AreaTargetComponent;
  let fixture: ComponentFixture<AreaTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
