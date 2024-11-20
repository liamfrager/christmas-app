import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsDisplayComponent } from './lists-display.component';

describe('ListsDisplayComponent', () => {
  let component: ListsDisplayComponent;
  let fixture: ComponentFixture<ListsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
