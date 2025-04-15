import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitedMembersComponent } from './exited-members.component';

describe('ExitedMembersComponent', () => {
  let component: ExitedMembersComponent;
  let fixture: ComponentFixture<ExitedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitedMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
