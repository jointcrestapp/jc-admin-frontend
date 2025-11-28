import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycPreviewModalComponent } from './kyc-preview-modal.component';

describe('KycPreviewModalComponent', () => {
  let component: KycPreviewModalComponent;
  let fixture: ComponentFixture<KycPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
