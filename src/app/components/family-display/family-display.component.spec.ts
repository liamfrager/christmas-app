import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDisplayComponent } from './family-display.component';

describe('FamilyDisplayComponent', () => {
  let component: FamilyDisplayComponent;
  let fixture: ComponentFixture<FamilyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
