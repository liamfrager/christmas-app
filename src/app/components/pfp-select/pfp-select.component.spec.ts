import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfpSelectComponent } from './pfp-select.component';

describe('PfpSelectComponent', () => {
  let component: PfpSelectComponent;
  let fixture: ComponentFixture<PfpSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PfpSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfpSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
