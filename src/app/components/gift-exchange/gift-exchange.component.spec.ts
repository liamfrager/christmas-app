import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftExchangeComponent } from './gift-exchange.component';

describe('GiftExchangeComponent', () => {
  let component: GiftExchangeComponent;
  let fixture: ComponentFixture<GiftExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftExchangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
