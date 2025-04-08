import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThriftTierComponent } from './add-thrift-tier.component';

describe('AddThriftTierComponent', () => {
  let component: AddThriftTierComponent;
  let fixture: ComponentFixture<AddThriftTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThriftTierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThriftTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
