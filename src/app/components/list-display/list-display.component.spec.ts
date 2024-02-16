import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplayComponent } from './ListDisplayComponent';

describe('ListDisplayComponent', () => {
  let component: ListDisplayComponent;
  let fixture: ComponentFixture<ListDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
