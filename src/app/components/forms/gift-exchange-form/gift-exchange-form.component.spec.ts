import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftExchangeFormComponent } from './gift-exchange-form.component';

describe('GiftExchangeFormComponent', () => {
  let component: GiftExchangeFormComponent;
  let fixture: ComponentFixture<GiftExchangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftExchangeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftExchangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
