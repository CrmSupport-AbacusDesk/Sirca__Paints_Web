import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartywisetopsellComponent } from './partywisetopsell.component';

describe('PartywisetopsellComponent', () => {
  let component: PartywisetopsellComponent;
  let fixture: ComponentFixture<PartywisetopsellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartywisetopsellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartywisetopsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
