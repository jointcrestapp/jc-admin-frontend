import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycSubmissionsComponent } from './kyc-submissions.component';

describe('KycSubmissionsComponent', () => {
  let component: KycSubmissionsComponent;
  let fixture: ComponentFixture<KycSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
