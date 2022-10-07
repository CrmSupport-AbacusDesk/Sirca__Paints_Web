import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditleadComponent } from './editlead.component';

describe('EditleadComponent', () => {
  let component: EditleadComponent;
  let fixture: ComponentFixture<EditleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
