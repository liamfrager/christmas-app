import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftDetailsModalComponent } from './gift-details-modal.component';

describe('GiftDetailsModalComponent', () => {
  let component: GiftDetailsModalComponent;
  let fixture: ComponentFixture<GiftDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GiftDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
