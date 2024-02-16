import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftDisplayComponent } from './gift-display.component';

describe('GiftDisplayComponent', () => {
  let component: GiftDisplayComponent;
  let fixture: ComponentFixture<GiftDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GiftDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
