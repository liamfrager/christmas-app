import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWishGiftComponent } from './add-wish-gift.component';

describe('AddGiftComponent', () => {
  let component: AddWishGiftComponent;
  let fixture: ComponentFixture<AddWishGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWishGiftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWishGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
