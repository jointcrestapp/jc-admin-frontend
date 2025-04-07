import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMembersComponent } from './pending-members.component';

describe('PendingMembersComponent', () => {
  let component: PendingMembersComponent;
  let fixture: ComponentFixture<PendingMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
