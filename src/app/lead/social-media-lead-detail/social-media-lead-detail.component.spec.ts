import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLeadDetailComponent } from './social-media-lead-detail.component';

describe('SocialMediaLeadDetailComponent', () => {
  let component: SocialMediaLeadDetailComponent;
  let fixture: ComponentFixture<SocialMediaLeadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialMediaLeadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaLeadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
