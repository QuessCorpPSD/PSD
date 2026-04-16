import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycodedragdropComponent } from './paycodedragdrop.component';

describe('PaycodedragdropComponent', () => {
  let component: PaycodedragdropComponent;
  let fixture: ComponentFixture<PaycodedragdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaycodedragdropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaycodedragdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
