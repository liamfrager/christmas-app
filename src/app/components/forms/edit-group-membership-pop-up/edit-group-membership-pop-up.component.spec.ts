import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupMembershipPopUpComponent } from './edit-group-membership-pop-up.component';

describe('EditGroupMembershipPopUpComponent', () => {
  let component: EditGroupMembershipPopUpComponent;
  let fixture: ComponentFixture<EditGroupMembershipPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupMembershipPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGroupMembershipPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
