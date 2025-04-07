import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThriftTierComponent } from './edit-thrift-tier.component';

describe('EditThriftTierComponent', () => {
  let component: EditThriftTierComponent;
  let fixture: ComponentFixture<EditThriftTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditThriftTierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditThriftTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
