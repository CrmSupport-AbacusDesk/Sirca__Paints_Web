import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLeadListComponent } from './social-media-lead-list.component';

describe('SocialMediaLeadListComponent', () => {
  let component: SocialMediaLeadListComponent;
  let fixture: ComponentFixture<SocialMediaLeadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialMediaLeadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaLeadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
