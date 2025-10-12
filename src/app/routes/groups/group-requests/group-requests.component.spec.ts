import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestsComponent } from './group-requests.component';

describe('GroupRequestsComponent', () => {
  let component: GroupRequestsComponent;
  let fixture: ComponentFixture<GroupRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
