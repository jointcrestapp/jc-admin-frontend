import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDividendComponent } from './generate-dividend.component';

describe('GenerateDividendComponent', () => {
  let component: GenerateDividendComponent;
  let fixture: ComponentFixture<GenerateDividendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateDividendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateDividendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
