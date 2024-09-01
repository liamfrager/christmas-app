import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShoppingGiftComponent } from './add-shopping-gift.component';

describe('AddShoppingGiftComponent', () => {
  let component: AddShoppingGiftComponent;
  let fixture: ComponentFixture<AddShoppingGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShoppingGiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShoppingGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
