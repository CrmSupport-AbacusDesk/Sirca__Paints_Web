import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopNGiftMasterComponent } from './pop-n-gift-master.component';

describe('PopNGiftMasterComponent', () => {
  let component: PopNGiftMasterComponent;
  let fixture: ComponentFixture<PopNGiftMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopNGiftMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopNGiftMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
