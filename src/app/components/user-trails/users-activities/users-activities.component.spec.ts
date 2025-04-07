import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersActivitiesComponent } from './users-activities.component';

describe('UsersActivitiesComponent', () => {
  let component: UsersActivitiesComponent;
  let fixture: ComponentFixture<UsersActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
