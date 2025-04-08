import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersRolesComponent } from './all-users-roles.component';

describe('AllUsersRolesComponent', () => {
  let component: AllUsersRolesComponent;
  let fixture: ComponentFixture<AllUsersRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUsersRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUsersRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
