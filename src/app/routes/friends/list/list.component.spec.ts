import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListComponent } from './list.component';

describe('ListComponent', () => {
  let component: FriendsListComponent;
  let fixture: ComponentFixture<FriendsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
